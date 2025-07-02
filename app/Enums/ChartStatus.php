<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ChartStatus: string
{
    use EnumToArray;
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ACTIVE = 'active';                 // Default, usable project
    case INACTIVE = 'inactive';             // Manually disabled by user or system
    case OVER_PLAN_LIMIT = 'over-plan-limit'; // Project exceeds downgraded plan limits
    case ARCHIVED = 'archived';             // Manually archived by user
    case READ_ONLY = 'read-only';           // Viewable but not editable (optional)
    case PENDING_DELETION = 'pending-deletion'; // Marked for deletion after downgrade grace period
    case DELETED = 'deleted';               // Soft-deleted (for record-keeping or recovery)
}
