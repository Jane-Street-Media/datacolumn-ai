<?php

namespace App;

enum DatasetSource: string
{
    case FILE_IMPORT = 'file-import';
    case MANUAL_ENTRY = 'manual-entry';
}
