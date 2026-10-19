#include <clap/clap.h>
#include "MidwestAmpDSP.hpp"
#include <cstring>
#include <algorithm>
#include <vector>
#include <iostream>

using namespace EmoAudioTools;

// Identificadores dos Parâmetros
enum ParamIds : clap_id {
    PARAM_DRIVE = 0,
    PARAM_BASS = 1,
    PARAM_MID = 2,
    PARAM_TREBLE = 3,
    PARAM_PRESENCE = 4,
    PARAM_CHANNEL = 5,
    PARAM_CABINET = 6,
    PARAM_BRIGHT = 7,
    PARAM_MASTER = 8,
    PARAM_COUNT = 9
};

static const char* s_midwest_amp_features[] = {
    CLAP_PLUGIN_FEATURE_AUDIO_EFFECT,
    CLAP_PLUGIN_FEATURE_DISTORTION,
    nullptr
};

static const clap_plugin_descriptor_t s_midwest_amp_desc = {
    CLAP_VERSION,
    "org.undergroundtools.midwestamp",
    "MidwestAmp",
    "Underground Tools",
    "https://github.com/FelipeGardenghiDev/underground-tools",
    "",
    "",
    "1.0.0",
    "Midwest Emo & Screamo Tube Amp Simulator + Cab IR",
    s_midwest_amp_features
};


struct MidwestAmpClap {
    clap_plugin_t plugin;
    const clap_host_t* host;
    MidwestAmpDSP amp;

    // Valores atuais dos parâmetros
    double drive = 0.35;
    double bass = 0.50;
    double mid = 0.60;
    double treble = 0.70;
    double presence = 0.50;
    double channel = 0.0;  // 0: Clean, 1: Crunch, 2: Screamo
    double cabinet = 0.0;  // 0: 2x12, 1: Greenback, 2: V30, 3: Bypass
    double bright = 1.0;   // 1.0 = Ligado
    double master = 0.0;   // dB (-60 a +12)

    MidwestAmpClap(const clap_host_t* h) : host(h) {
        syncDSP();
    }

    void syncDSP() {
        amp.setDrive(static_cast<float>(drive));
        amp.setToneStack(static_cast<float>(bass), static_cast<float>(mid), static_cast<float>(treble));
        amp.setPresence(static_cast<float>(presence));
        amp.setChannel(static_cast<AmpChannel>(static_cast<int>(channel)));
        amp.setCabinet(static_cast<CabinetType>(static_cast<int>(cabinet)));
        amp.setBrightSwitch(bright > 0.5);
        amp.setMasterVolumeDb(static_cast<float>(master));
    }
};

// --- Extensão: Audio Ports (Stereo In / Stereo Out) ---
static uint32_t clap_midwest_audio_ports_count(const clap_plugin_t* /*plugin*/, bool /*is_input*/) {
    return 1;
}

static bool clap_midwest_audio_ports_get(const clap_plugin_t* /*plugin*/, uint32_t index, bool is_input, clap_audio_port_info_t* info) {
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
    clap_midwest_audio_ports_count,
    clap_midwest_audio_ports_get
};

// --- Extensão: Params ---
static uint32_t clap_midwest_params_count(const clap_plugin_t* /*plugin*/) {
    return PARAM_COUNT;
}

static bool clap_midwest_params_get_info(const clap_plugin_t* /*plugin*/, uint32_t index, clap_param_info_t* info) {
    info->flags = CLAP_PARAM_IS_AUTOMATABLE;
    std::memset(info->module, 0, sizeof(info->module));

    switch (index) {
        case PARAM_DRIVE:
            info->id = PARAM_DRIVE;
            std::strncpy(info->name, "Drive", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 0.35;
            return true;
        case PARAM_BASS:
            info->id = PARAM_BASS;
            std::strncpy(info->name, "Bass", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 0.50;
            return true;
        case PARAM_MID:
            info->id = PARAM_MID;
            std::strncpy(info->name, "Middle", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 0.60;
            return true;
        case PARAM_TREBLE:
            info->id = PARAM_TREBLE;
            std::strncpy(info->name, "Treble", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 0.70;
            return true;
        case PARAM_PRESENCE:
            info->id = PARAM_PRESENCE;
            std::strncpy(info->name, "Presence", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 0.50;
            return true;
        case PARAM_CHANNEL:
            info->id = PARAM_CHANNEL;
            info->flags |= CLAP_PARAM_IS_STEPPED;
            std::strncpy(info->name, "Channel (0:Clean 1:Crunch 2:Screamo)", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 2.0;
            info->default_value = 0.0;
            return true;
        case PARAM_CABINET:
            info->id = PARAM_CABINET;
            info->flags |= CLAP_PARAM_IS_STEPPED;
            std::strncpy(info->name, "Cabinet (0:2x12 1:Greenback 2:V30 3:Bypass)", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 3.0;
            info->default_value = 0.0;
            return true;
        case PARAM_BRIGHT:
            info->id = PARAM_BRIGHT;
            info->flags |= CLAP_PARAM_IS_STEPPED;
            std::strncpy(info->name, "Bright Switch", sizeof(info->name) - 1);
            info->min_value = 0.0;
            info->max_value = 1.0;
            info->default_value = 1.0;
            return true;
        case PARAM_MASTER:
            info->id = PARAM_MASTER;
            std::strncpy(info->name, "Master Volume (dB)", sizeof(info->name) - 1);
            info->min_value = -60.0;
            info->max_value = 12.0;
            info->default_value = 0.0;
            return true;
    }
    return false;
}

static bool clap_midwest_params_get_value(const clap_plugin_t* plugin, clap_id param_id, double* out_value) {
    auto* self = static_cast<MidwestAmpClap*>(plugin->plugin_data);
    switch (param_id) {
        case PARAM_DRIVE: *out_value = self->drive; return true;
        case PARAM_BASS: *out_value = self->bass; return true;
        case PARAM_MID: *out_value = self->mid; return true;
        case PARAM_TREBLE: *out_value = self->treble; return true;
        case PARAM_PRESENCE: *out_value = self->presence; return true;
        case PARAM_CHANNEL: *out_value = self->channel; return true;
        case PARAM_CABINET: *out_value = self->cabinet; return true;
        case PARAM_BRIGHT: *out_value = self->bright; return true;
        case PARAM_MASTER: *out_value = self->master; return true;
    }
    return false;
}

static bool clap_midwest_params_value_to_text(const clap_plugin_t* /*plugin*/, clap_id /*param_id*/, double value, char* out_buffer, uint32_t out_buffer_capacity) {
    snprintf(out_buffer, out_buffer_capacity, "%.2f", value);
    return true;
}

static bool clap_midwest_params_text_to_value(const clap_plugin_t* /*plugin*/, clap_id /*param_id*/, const char* param_value_text, double* out_value) {
    *out_value = std::atof(param_value_text);
    return true;
}

static void clap_midwest_params_flush(const clap_plugin_t* plugin, const clap_input_events_t* in, const clap_output_events_t* /*out*/) {
    auto* self = static_cast<MidwestAmpClap*>(plugin->plugin_data);
    if (!in) return;
    uint32_t num_events = in->size(in);
    for (uint32_t i = 0; i < num_events; ++i) {
        const clap_event_header_t* hdr = in->get(in, i);
        if (hdr->space_id == CLAP_CORE_EVENT_SPACE_ID && hdr->type == CLAP_EVENT_PARAM_VALUE) {
            const auto* ev = reinterpret_cast<const clap_event_param_value_t*>(hdr);
            switch (ev->param_id) {
                case PARAM_DRIVE: self->drive = ev->value; break;
                case PARAM_BASS: self->bass = ev->value; break;
                case PARAM_MID: self->mid = ev->value; break;
                case PARAM_TREBLE: self->treble = ev->value; break;
                case PARAM_PRESENCE: self->presence = ev->value; break;
                case PARAM_CHANNEL: self->channel = ev->value; break;
                case PARAM_CABINET: self->cabinet = ev->value; break;
                case PARAM_BRIGHT: self->bright = ev->value; break;
                case PARAM_MASTER: self->master = ev->value; break;
            }
        }
    }
    self->syncDSP();
}

static const clap_plugin_params_t s_params_ext = {
    clap_midwest_params_count,
    clap_midwest_params_get_info,
    clap_midwest_params_get_value,
    clap_midwest_params_value_to_text,
    clap_midwest_params_text_to_value,
    clap_midwest_params_flush
};

// --- Ciclo de Vida do Plugin CLAP ---
static bool clap_midwest_init(const clap_plugin_t* /*plugin*/) {
    return true;
}

static void clap_midwest_destroy(const clap_plugin_t* plugin) {
    auto* self = static_cast<MidwestAmpClap*>(plugin->plugin_data);
    delete self;
}

static bool clap_midwest_activate(const clap_plugin_t* plugin, double sample_rate, uint32_t /*min_frames_count*/, uint32_t /*max_frames_count*/) {
    auto* self = static_cast<MidwestAmpClap*>(plugin->plugin_data);
    self->amp.prepare(static_cast<float>(sample_rate));
    self->syncDSP();
    return true;
}

static void clap_midwest_deactivate(const clap_plugin_t* /*plugin*/) {}

static bool clap_midwest_start_processing(const clap_plugin_t* /*plugin*/) {
    return true;
}

static void clap_midwest_stop_processing(const clap_plugin_t* /*plugin*/) {}

static void clap_midwest_reset(const clap_plugin_t* /*plugin*/) {}

static clap_process_status clap_midwest_process(const clap_plugin_t* plugin, const clap_process_t* process) {
    auto* self = static_cast<MidwestAmpClap*>(plugin->plugin_data);

    // 1. Processa eventos de parâmetros em tempo real
    if (process->in_events) {
        clap_midwest_params_flush(plugin, process->in_events, process->out_events);
    }

    // 2. Processa o fluxo de áudio estéreo
    if (process->audio_inputs_count > 0 && process->audio_outputs_count > 0) {
        const auto& in_port = process->audio_inputs[0];
        auto& out_port = process->audio_outputs[0];

        if (in_port.channel_count >= 2 && out_port.channel_count >= 2) {
            const float* in_ptrs[2] = { in_port.data32[0], in_port.data32[1] };
            float* out_ptrs[2] = { out_port.data32[0], out_port.data32[1] };
            self->amp.process(in_ptrs, out_ptrs, 2, process->frames_count);
        } else if (in_port.channel_count >= 1 && out_port.channel_count >= 1) {
            const float* in_ptrs[2] = { in_port.data32[0], in_port.data32[0] };
            float* out_ptrs[2] = { out_port.data32[0], out_port.data32[0] };
            self->amp.process(in_ptrs, out_ptrs, 1, process->frames_count);
        }
    }

    return CLAP_PROCESS_CONTINUE;
}

static const void* clap_midwest_get_extension(const clap_plugin_t* /*plugin*/, const char* id) {
    if (std::strcmp(id, CLAP_EXT_AUDIO_PORTS) == 0) return &s_audio_ports_ext;
    if (std::strcmp(id, CLAP_EXT_PARAMS) == 0) return &s_params_ext;
    return nullptr;
}

static void clap_midwest_on_main_thread(const clap_plugin_t* /*plugin*/) {}

// --- Factory de Criação do Plugin ---
static uint32_t clap_midwest_factory_get_plugin_count(const clap_plugin_factory_t* /*factory*/) {
    return 1;
}

static const clap_plugin_descriptor_t* clap_midwest_factory_get_plugin_descriptor(const clap_plugin_factory_t* /*factory*/, uint32_t index) {
    return (index == 0) ? &s_midwest_amp_desc : nullptr;
}

static const clap_plugin_t* clap_midwest_factory_create_plugin(const clap_plugin_factory_t* /*factory*/, const clap_host_t* host, const char* plugin_id) {
    if (std::strcmp(plugin_id, s_midwest_amp_desc.id) != 0) return nullptr;

    auto* holder = new MidwestAmpClap(host);
    holder->plugin.desc = &s_midwest_amp_desc;
    holder->plugin.plugin_data = holder;
    holder->plugin.init = clap_midwest_init;
    holder->plugin.destroy = clap_midwest_destroy;
    holder->plugin.activate = clap_midwest_activate;
    holder->plugin.deactivate = clap_midwest_deactivate;
    holder->plugin.start_processing = clap_midwest_start_processing;
    holder->plugin.stop_processing = clap_midwest_stop_processing;
    holder->plugin.reset = clap_midwest_reset;
    holder->plugin.process = clap_midwest_process;
    holder->plugin.get_extension = clap_midwest_get_extension;
    holder->plugin.on_main_thread = clap_midwest_on_main_thread;

    return &holder->plugin;
}

static const clap_plugin_factory_t s_clap_factory = {
    clap_midwest_factory_get_plugin_count,
    clap_midwest_factory_get_plugin_descriptor,
    clap_midwest_factory_create_plugin
};

// --- Entry Point Exportado da DLL / CLAP ---
static bool clap_midwest_entry_init(const char* /*plugin_path*/) {
    return true;
}

static void clap_midwest_entry_deinit() {}

static const void* clap_midwest_entry_get_factory(const char* factory_id) {
    if (std::strcmp(factory_id, CLAP_PLUGIN_FACTORY_ID) == 0) return &s_clap_factory;
    return nullptr;
}

CLAP_EXPORT const clap_plugin_entry_t clap_entry = {
    CLAP_VERSION,
    clap_midwest_entry_init,
    clap_midwest_entry_deinit,
    clap_midwest_entry_get_factory
};
