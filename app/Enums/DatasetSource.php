<?php

namespace App\Enums;

enum DatasetSource: string
{
    case FILE_IMPORT = 'file-import';
    case MANUAL_ENTRY = 'manual-entry';
    case AI_ASSISTANT = 'ai-assistant';
}
