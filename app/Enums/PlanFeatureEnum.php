<?php

namespace App\Enums;

use App\Models\Team;

enum PlanFeatureEnum: string
{
    case NO_OF_INVITATIONS = 'no_of_invitations';
    case NO_OF_FOLDERS = 'no_of_folders';
    case NO_OF_PROJECTS = 'no_of_projects';
    case NO_OF_CHARTS = 'no_of_charts';
    case NO_OF_SEATS = 'no_of_seats';
    case NO_OF_AI_GENERATIONS = 'no_of_ai_generations';
    case API_INTEGRATIONS = 'api_integrations';
    case SLA = 'sla';
    case FULL_WHITE_LABELING = 'full_white_labeling';
    case CUSTOM_CHART_TYPES = 'custom_chart_types';
    case DEDICATED_SUPPORT = 'dedicated_support';
    case ADVANCED_SECURITY = 'advanced_security';
    case AI_ASSISTANT = 'ai_assistant';
    case WATERMARK = 'watermark';
    case BASIC_CUSTOMIZATION = 'basic_customization';
    case BRANDED_EMBEDS = 'branded_embeds';
    case COMMUNITY_SUPPORT = 'community_support';
    case BASIC_EXPORT_OPTIONS = 'basic_export_options';
    case NO_OF_EXPORTS = 'no_of_exports';
    case PRIORITY_RENDERING = 'priority_rendering';
    case CHART_PRESETS = 'chart_presets';
    case CUSTOM_EMBED_DOMAIN = 'custom_embed_domain';
    case ADVANCED_CUSTOMIZATION = 'advanced_customization';
    case SVG_EXPORTS = 'svg_exports';
    case PNG_EXPORTS = 'png_exports';
    case EMAIL_SUPPORT = 'email_support';
    case SHARED_FOLDERS = 'shared_folders';
    case SHARED_STYLES = 'shared_styles';
    case ACCESS_CONTROLS = 'access_controls';
    case PRIORITY_SUPPORT = 'priority_support';
    case TEAM_COLLABORATION = 'team_collaboration';
    case BRAND_CUSTOMIZATION = 'brand_customization';
    case USAGE_ANALYTICS = 'usage_analytics';

    public function getFeatureUsageCount(Team $team): int
    {
        return match ($this) {
            self::NO_OF_PROJECTS => $team->projects()->count(),
            self::NO_OF_INVITATIONS => $team->users()->count() + $team->invitations()->count(),
            self::NO_OF_CHARTS => $team->charts()->count(),
        };
    }

    public function featureErrorMessage(): string
    {
        return match ($this) {
            self::NO_OF_PROJECTS => 'You have reached the maximum number of projects allowed by your plan.',
            self::NO_OF_INVITATIONS => 'You have reached the maximum number of invitations allowed by your plan.',
            self::NO_OF_CHARTS => 'You have reached the maximum number of charts allowed by your plan.',
        };
    }
}
