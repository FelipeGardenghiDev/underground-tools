#include <clap/clap.h>
#include "CryTuneDSP.hpp"
#include <cstring>
#include <algorithm>
#include <vector>
#include <iostream>

using namespace EmoAudioTools;

// Identificadores dos Parâmetros
enum ParamIds : clap_id {
    PARAM_ROOT_NOTE = 0,
    PARAM_SCALE = 1,
    PARAM_RETUNE_SPEED = 2,
    PARAM_AIR_PRESENCE = 3,
    PARAM_MIX = 4,
    PARAM_COUNT = 5
};

static const char* s_cry_tune_features[] = {
    CLAP_PLUGIN_FEATURE_AUDIO_EFFECT,
    CLAP_PLUGIN_FEATURE_PITCH_CORRECTION,
    nullptr
};

static const clap_plugin_descriptor_t s_cry_tune_desc = {
    CLAP_VERSION,
    "org.undergroundtools.crytune",
    "CryTune",
    "Underground Tools",
    "https://github.com/FelipeGardenghiDev/underground-tools",
    "",
    "",
    "1.0.0",
    "Midwest Emo & Screamo Pitch Corrector + Air Presence",
    s_cry_tune_features
};

struct CryTuneClap {
    clap_plugin_t plugin;
    const clap_host_t* host;
    CryTuneDSP dsp;

    // Valores atuais dos parâmetros
    double rootNote = 4.0;       // 4 = E (Mi)
    double scale = 3.0;          // 3 = Midwest Emo E (DAEAC#E)
    double retuneSpeed = 20.0;   // 20ms
    double airPresence = 3.5;    // +3.5 dB
    double mix = 1.0;            // 100% wet vocal

    CryTuneClap(const clap_host_t* h) : host(h) {
        syncDSP();
    }

    void syncDSP() {
        dsp.setRootNote(static_cast<int>(rootNote));
        dsp.setScale(static_cast<MusicalScale>(static_cast<int>(scale)));
        dsp.setRetuneSpeedMs(static_cast<float>(retuneSpeed));
        dsp.setAirPresenceDb(static_cast<float>(airPresence));
        dsp.setMix(static_cast<float>(mix));
    }
};

// --- Extensão: Audio Ports (Stereo In / Stereo Out) ---
static uint32_t clap_cry_tune_audio_ports_count(const clap_plugin_t* /*plugin*/, bool /*is_input*/) {
    return 1;
}

static bool clap_cry_tune_audio_ports_get(const clap_plugin_t* /*plugin*/, uint32_t index, bool is_input, clap_audio_port_info_t* info) {
    if (index != 0) return false;
    info->id = 0;
    if (is_input) {
        std::strncpy(info->name, "Stereo In", sizeof(info->name) - 1);
    } else {
        std::strncpy(info->name, "Stereo Out", sizeof(info->name) - 1);
    }
    info->flags = CLAP_AUDIO_PORT_IS_MAIN;
    info->channel_count = 2;
    info->port_type = CLAP_PORT_STEREO;
    info->in_place_pair = CLAP_INVALID_ID;
    return true;
}

static const clap_plugin_audio_ports_t s_audio_ports_ext = {
    clap_cry_tune_audio_ports_count,
    clap_cry_tune_audio_ports_get
};

// --- Extensão: Params ---
static uint32_t clap_cry_tune_params_count(const clap_plugin_t* /*plugin*/) {
    return PARAM_COUNT;
}

static bool clap_cry_tune_params_get_info(const clap_plugin_t* /*plugin*/, uint32_t index, clap_param_info_t* info) {
    info->flags = CLAP_PARAM_IS_AUTOMATABLE;
    std::memset(info->module, 0, sizeof(info->module));

    switch (index) {
        case PARAM_ROOT_NOTE:
            info->id = PARAM_ROOT_NOTE;
            info->flags |= CLAP_PARAM_IS_STEPPED;
            std::strncpy(info->name, "Root Key (0:C ... 11:B)", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 11.0;
            info->default_value = 4.0; // E
            return true;
        case PARAM_SCALE:
            info->id = PARAM_SCALE;
            info->flags |= CLAP_PARAM_IS_STEPPED;
            std::strncpy(info->name, "Musical Scale", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 5.0;
            info->default_value = 3.0; // MidwestEmo_E
            return true;
        case PARAM_RETUNE_SPEED:
            info->id = PARAM_RETUNE_SPEED;
            std::strncpy(info->name, "Retune Speed (ms)", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 150.0;
            info->default_value = 20.0;
            return true;
        case PARAM_AIR_PRESENCE:
            info->id = PARAM_AIR_PRESENCE;
            std::strncpy(info->name, "Air Presence (dB)", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 9.0;
            info->default_value = 3.5;
            return true;
        case PARAM_MIX:
            info->id = PARAM_MIX;
            std::strncpy(info->name, "Mix (Dry/Wet)", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 1.0;
            return true;
    }
    return false;
}

static bool clap_cry_tune_params_get_value(const clap_plugin_t* plugin, clap_id param_id, double* out_value) {
    auto* self = static_cast<CryTuneClap*>(plugin->plugin_data);
    switch (param_id) {
        case PARAM_ROOT_NOTE: *out_value = self->rootNote; return true;
        case PARAM_SCALE: *out_value = self->scale; return true;
        case PARAM_RETUNE_SPEED: *out_value = self->retuneSpeed; return true;
        case PARAM_AIR_PRESENCE: *out_value = self->airPresence; return true;
        case PARAM_MIX: *out_value = self->mix; return true;
    }
    return false;
}

static bool clap_cry_tune_params_value_to_text(const clap_plugin_t* /*plugin*/, clap_id /*param_id*/, double value, char* out_buffer, uint32_t out_buffer_capacity) {
    snprintf(out_buffer, out_buffer_capacity, "%.2f", value);
    return true;
}

static bool clap_cry_tune_params_text_to_value(const clap_plugin_t* /*plugin*/, clap_id /*param_id*/, const char* param_value_text, double* out_value) {
    *out_value = std::atof(param_value_text);
    return true;
}

static void clap_cry_tune_params_flush(const clap_plugin_t* plugin, const clap_input_events_t* in, const clap_output_events_t* /*out*/) {
    auto* self = static_cast<CryTuneClap*>(plugin->plugin_data);
    if (!in) return;
    uint32_t num_events = in->size(in);
    for (uint32_t i = 0; i < num_events; ++i) {
        const clap_event_header_t* hdr = in->get(in, i);
        if (hdr->space_id == CLAP_CORE_EVENT_SPACE_ID && hdr->type == CLAP_EVENT_PARAM_VALUE) {
            const auto* ev = reinterpret_cast<const clap_event_param_value_t*>(hdr);
            switch (ev->param_id) {
                case PARAM_ROOT_NOTE: self->rootNote = ev->value; break;
                case PARAM_SCALE: self->scale = ev->value; break;
                case PARAM_RETUNE_SPEED: self->retuneSpeed = ev->value; break;
                case PARAM_AIR_PRESENCE: self->airPresence = ev->value; break;
                case PARAM_MIX: self->mix = ev->value; break;
            }
        }
    }
    self->syncDSP();
}

static const clap_plugin_params_t s_params_ext = {
    clap_cry_tune_params_count,
    clap_cry_tune_params_get_info,
    clap_cry_tune_params_get_value,
    clap_cry_tune_params_value_to_text,
    clap_cry_tune_params_text_to_value,
    clap_cry_tune_params_flush
};

// --- Ciclo de Vida do Plugin CLAP ---
static bool clap_cry_tune_init(const clap_plugin_t* /*plugin*/) {
    return true;
}

static void clap_cry_tune_destroy(const clap_plugin_t* plugin) {
    auto* self = static_cast<CryTuneClap*>(plugin->plugin_data);
    delete self;
}

static bool clap_cry_tune_activate(const clap_plugin_t* plugin, double sample_rate, uint32_t /*min_frames_count*/, uint32_t /*max_frames_count*/) {
    auto* self = static_cast<CryTuneClap*>(plugin->plugin_data);
    self->dsp.prepare(static_cast<float>(sample_rate));
    self->syncDSP();
    return true;
}

static void clap_cry_tune_deactivate(const clap_plugin_t* /*plugin*/) {}
static bool clap_cry_tune_start_processing(const clap_plugin_t* /*plugin*/) { return true; }
static void clap_cry_tune_stop_processing(const clap_plugin_t* /*plugin*/) {}
static void clap_cry_tune_reset(const clap_plugin_t* /*plugin*/) {}

static clap_process_status clap_cry_tune_process(const clap_plugin_t* plugin, const clap_process_t* process) {
    auto* self = static_cast<CryTuneClap*>(plugin->plugin_data);

    if (process->in_events) {
        clap_cry_tune_params_flush(plugin, process->in_events, process->out_events);
    }

    if (process->audio_inputs_count > 0 && process->audio_outputs_count > 0) {
        const auto& in_port = process->audio_inputs[0];
        auto& out_port = process->audio_outputs[0];

        if (in_port.channel_count >= 2 && out_port.channel_count >= 2) {
            const float* in_ptrs[2] = { in_port.data32[0], in_port.data32[1] };
            float* out_ptrs[2] = { out_port.data32[0], out_port.data32[1] };
            self->dsp.process(in_ptrs, out_ptrs, 2, process->frames_count);
        } else if (in_port.channel_count >= 1 && out_port.channel_count >= 1) {
            const float* in_ptrs[2] = { in_port.data32[0], in_port.data32[0] };
            float* out_ptrs[2] = { out_port.data32[0], out_port.data32[0] };
            self->dsp.process(in_ptrs, out_ptrs, 1, process->frames_count);
        }
    }

    return CLAP_PROCESS_CONTINUE;
}

static const void* clap_cry_tune_get_extension(const clap_plugin_t* /*plugin*/, const char* id) {
    if (std::strcmp(id, CLAP_EXT_AUDIO_PORTS) == 0) return &s_audio_ports_ext;
    if (std::strcmp(id, CLAP_EXT_PARAMS) == 0) return &s_params_ext;
    return nullptr;
}

static void clap_cry_tune_on_main_thread(const clap_plugin_t* /*plugin*/) {}

// --- Factory de Criação do Plugin ---
static uint32_t clap_cry_tune_factory_get_plugin_count(const clap_plugin_factory_t* /*factory*/) {
    return 1;
}

static const clap_plugin_descriptor_t* clap_cry_tune_factory_get_plugin_descriptor(const clap_plugin_factory_t* /*factory*/, uint32_t index) {
    return (index == 0) ? &s_cry_tune_desc : nullptr;
}

static const clap_plugin_t* clap_cry_tune_factory_create_plugin(const clap_plugin_factory_t* /*factory*/, const clap_host_t* host, const char* plugin_id) {
    if (std::strcmp(plugin_id, s_cry_tune_desc.id) != 0) return nullptr;

    auto* holder = new CryTuneClap(host);
    holder->plugin.desc = &s_cry_tune_desc;
    holder->plugin.plugin_data = holder;
    holder->plugin.init = clap_cry_tune_init;
    holder->plugin.destroy = clap_cry_tune_destroy;
    holder->plugin.activate = clap_cry_tune_activate;
    holder->plugin.deactivate = clap_cry_tune_deactivate;
    holder->plugin.start_processing = clap_cry_tune_start_processing;
    holder->plugin.stop_processing = clap_cry_tune_stop_processing;
    holder->plugin.reset = clap_cry_tune_reset;
    holder->plugin.process = clap_cry_tune_process;
    holder->plugin.get_extension = clap_cry_tune_get_extension;
    holder->plugin.on_main_thread = clap_cry_tune_on_main_thread;

    return &holder->plugin;
}

static const clap_plugin_factory_t s_clap_factory = {
    clap_cry_tune_factory_get_plugin_count,
    clap_cry_tune_factory_get_plugin_descriptor,
    clap_cry_tune_factory_create_plugin
};

// --- Entry Point Exportado da DLL / CLAP ---
static bool clap_cry_tune_entry_init(const char* /*plugin_path*/) {
    return true;
}

static void clap_cry_tune_entry_deinit() {}

static const void* clap_cry_tune_entry_get_factory(const char* factory_id) {
    if (std::strcmp(factory_id, CLAP_PLUGIN_FACTORY_ID) == 0) return &s_clap_factory;
    return nullptr;
}

CLAP_EXPORT const clap_plugin_entry_t clap_entry = {
    CLAP_VERSION,
    clap_cry_tune_entry_init,
    clap_cry_tune_entry_deinit,
    clap_cry_tune_entry_get_factory
};
