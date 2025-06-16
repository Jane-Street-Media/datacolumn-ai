<?php

namespace App;

enum ProjectStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
}
