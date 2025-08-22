<?php

namespace App\Enums;

enum NotificationType: string
{
    case IMPOUND_NOTICE = 'impound_notice';
    case DEADLINE_WARNING = 'deadline_warning';
    case PAYMENT_REMINDER = 'payment_reminder';
}
