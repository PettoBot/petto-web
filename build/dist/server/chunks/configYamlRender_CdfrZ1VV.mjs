const CONFIG_SCHEMA = {
  guilds: [
    ["prefix", "text", "!"],
    ["mute_role_id", "text", null],
    ["language", "text", "en"],
    ["bot_nickname", "text", null],
    ["bot_avatar_url", "text", null],
    ["bot_banner_url", "text", null],
    ["bot_description", "text", null],
    ["setup_channel_id", "text", null],
    ["bot_name_style", "json", null],
    ["invites_paused_until", "time", null],
    ["compliance_ignored", "bool", false],
    ["compliance_ignored_by", "text", null],
    ["compliance_ignored_at", "time", null],
    ["compliance_ignore_reason", "text", null],
    ["language_source", "text", null],
    ["prefixes", "list", null],
    ["image_mute_role_id", "text", null],
    ["reaction_mute_role_id", "text", null],
    ["global_stats_visible", "bool", false],
    ["global_stats_hidden", "bool", false]
  ],
  automod_config: [
    ["word_filter_enabled", "bool", false],
    ["word_filter_action", "text", "warn"],
    ["banned_words", "list", []],
    ["anti_spam_enabled", "bool", false],
    ["max_mentions", "num", 5],
    ["allowed_invite_codes", "list", []],
    ["anti_raid_enabled", "bool", false],
    ["raid_join_threshold", "num", 6],
    ["raid_window_seconds", "num", 10],
    ["raid_action", "text", "alert"],
    ["immune_role_ids", "list", []],
    ["anti_alt_enabled", "bool", false],
    ["anti_alt_min_age_days", "num", 7],
    ["anti_alt_action", "text", "kick"],
    ["repeat_threshold", "num", 3],
    ["repeat_window_seconds", "num", 10],
    ["caps_percent", "num", 70],
    ["caps_min_length", "num", 12],
    ["max_message_length", "num", 0],
    ["max_lines", "num", 0],
    ["exempt_channel_ids", "list", []],
    ["spam_repeat", "bool", true],
    ["allowed_link_domains", "list", []],
    ["spam_mentions", "bool", true],
    ["spam_invites", "bool", true],
    ["spam_caps", "bool", true],
    ["strike_limit", "num", 0],
    ["strike_window_minutes", "num", 10],
    ["strike_mute_minutes", "num", 10],
    ["no_avatar_enabled", "bool", false],
    ["no_avatar_action", "text", "kick"]
  ],
  antinuke_config: [
    ["enabled", "bool", false],
    ["action_threshold", "num", 5],
    ["window_seconds", "num", 10],
    ["whitelist_ids", "list", []],
    ["whitelist_role_ids", "list", []],
    ["alert_channel_id", "text", null],
    ["admin_ids", "list", []],
    ["owner_only", "bool", false],
    ["dm_owner", "bool", true],
    ["panic_enabled", "bool", false],
    ["panic_threshold", "num", 2],
    ["panic_window_minutes", "num", 10],
    ["panic_lockdown_minutes", "num", 30],
    ["panic_on_raid", "bool", true]
  ],
  antinuke_rules: [
    ["rule", "text", null],
    ["enabled", "bool", false],
    ["threshold", "num", 3],
    ["window_seconds", "num", 10],
    ["action", "text", "quarantine"],
    ["alert_channel_id", "text", null],
    ["whitelist_ids", "list", []],
    ["whitelist_role_ids", "list", []]
  ],
  scam_config: [
    ["enabled", "bool", false],
    ["action", "text", "alert"],
    ["timeout_minutes", "num", 120],
    ["delete_messages", "bool", true],
    ["delete_minutes", "num", 15],
    ["channels_threshold", "num", 3],
    ["window_seconds", "num", 30],
    ["scan_text", "bool", true],
    ["scan_new_accounts", "bool", true],
    ["new_account_hours", "num", 72],
    ["dm_user", "bool", true],
    ["alert_channel_id", "text", null],
    ["ping_role_id", "text", null],
    ["exempt_role_ids", "list", []],
    ["exempt_channel_ids", "list", []]
  ],
  honeypots: [
    ["channel_id", "text", null],
    ["punishment", "text", "softban"],
    ["panel_mode", "text", "default"],
    ["panel_text", "text", ""],
    ["panel_template", "text", null],
    ["dm_member", "bool", true],
    ["reinvite", "bool", true]
  ],
  role_triggers: [
    ["role_id", "text", null],
    ["action", "text", null],
    ["duration_ms", "num", null],
    ["reason", "text", null],
    ["on_event", "text", "role_added"]
  ],
  role_trigger_settings: [
    ["max_actions", "num", null]
  ],
  lockdown_config: [
    ["channel_ids", "list", []],
    ["pause_invites", "bool", true],
    ["raise_verification", "bool", false],
    ["auto_end_minutes", "num", 0],
    ["announce_channel_id", "text", null],
    ["message", "text", null]
  ],
  jail_config: [
    ["jail_role_id", "text", null],
    ["jail_channel_id", "text", null]
  ],
  automod_silent_channels: [
    ["channel_id", "text", null],
    ["action", "text", "warn"]
  ],
  warn_escalation_rules: [
    ["warn_count", "num", null],
    ["action", "text", null],
    ["duration_ms", "num", null]
  ],
  sanction_templates: [
    ["type", "text", null],
    ["dm_template", "text", null],
    ["reply_template", "text", null],
    ["log_template", "text", null]
  ],
  message_link_settings: [
    ["enabled", "bool", false],
    ["ignored_channels", "list", []]
  ],
  appeal_config: [
    ["enabled", "bool", false],
    ["greeting", "text", null],
    ["language", "text", "en"],
    ["rejoin_invite_code", "text", null],
    ["auto_invite", "bool", false],
    ["allow_server_id", "bool", true],
    ["punishment_types", "list", ["ban", "mute"]],
    ["punishment_details", "list", ["reason", "duration"]],
    ["punishment_source", "text", "both"],
    ["warns_max_age_days", "num", 30],
    ["anonymous_messages", "bool", false],
    ["allow_replies", "bool", true],
    ["store_days", "num", 7],
    ["submission_channel_id", "text", null],
    ["log_channel_id", "text", null],
    ["auto_thread", "bool", false],
    ["thread_name", "text", "Appeal by {username}"],
    ["ping_role_ids", "list", []],
    ["messages", "json", "{}"],
    ["brand", "json", "{}"],
    ["embed", "json", "{}"],
    ["slug", "text", null],
    ["dm_link_mode", "text", "always"],
    ["dm_link_types", "list", ["ban", "tempban", "softban", "kick", "timeout", "warn"]],
    ["dm_note", "text", null],
    ["min_wait_hours", "num", 0]
  ],
  appeal_forms: [
    ["name", "text", null],
    ["icon", "text", null],
    ["short_description", "text", null],
    ["description", "text", null],
    ["status", "text", "draft"],
    ["requirement_types", "list", []],
    ["block_on_reject", "text", "none"],
    ["generate_invite", "bool", false],
    ["sections", "json", "[]"],
    ["messages", "json", "{}"]
  ],
  permission_groups: [
    ["name", "text", null],
    ["level", "num", 0],
    ["is_base", "bool", false]
  ],
  command_permission_levels: [
    ["command_name", "text", null],
    ["required_level", "num", 0]
  ],
  dash_access: [
    ["role_id", "text", null],
    ["sections", "list", []],
    ["can_edit", "bool", false]
  ],
  command_restrictions: [
    ["command", "text", null],
    ["role_id", "text", null]
  ],
  log_entries: [
    ["channel_id", "text", null],
    ["event", "text", null],
    ["color", "num", null]
  ],
  log_ignored: [
    ["target_id", "text", null]
  ],
  level_config: [
    ["enabled", "bool", false],
    ["xp_min", "num", 15],
    ["xp_max", "num", 25],
    ["xp_per_vc_minute", "num", 5],
    ["cooldown_seconds", "num", 60],
    ["curve_a", "num", 1],
    ["curve_b", "num", 50],
    ["curve_c", "num", 100],
    ["difficulty", "num", 2.5],
    ["rounding", "num", 50],
    ["max_level", "num", 1e3],
    ["notify_mode", "text", "reply"],
    ["notify_channel_id", "text", null],
    ["notify_message", "text", "{user} just leveled up to **{level}**!"],
    ["notify_embed", "bool", false],
    ["notify_embed_template", "text", null],
    ["notify_every", "num", 1],
    ["role_mode", "text", "highest"],
    ["ignored_channel_ids", "list", []],
    ["join_xp", "num", 0],
    ["join_level", "num", 0],
    ["voice_enabled", "bool", true],
    ["voice_curve_a", "num", 1],
    ["voice_curve_b", "num", 50],
    ["voice_curve_c", "num", 100],
    ["voice_difficulty", "num", 2.5],
    ["voice_rounding", "num", 50],
    ["voice_max_level", "num", 1e3],
    ["voice_notify_mode", "text", "off"],
    ["voice_notify_channel_id", "text", null],
    ["voice_notify_message", "text", "{user} reached voice level **{level}**!"],
    ["voice_notify_embed", "bool", false],
    ["voice_notify_embed_template", "text", null],
    ["voice_notify_every", "num", 1],
    ["voice_role_mode", "text", "highest"],
    ["voice_ignored_channel_ids", "list", []],
    ["rank_style", "text", "card"],
    ["rank_card", "text", null],
    ["notify_card", "text", null],
    ["voice_notify_card", "text", null],
    ["min_message_chars", "num", 3],
    ["anti_repeat", "bool", true],
    ["voice_min_members", "num", 1],
    ["voice_ignore_muted", "bool", false],
    ["voice_alone_percent", "num", 100],
    ["daily_xp_cap", "num", 0],
    ["daily_bonus_xp", "num", 0],
    ["streak_bonus_xp", "num", 0],
    ["streak_max_days", "num", 7],
    ["notify_reply", "bool", true],
    ["notify_delete_after", "num", 0],
    ["notify_ping", "bool", true],
    ["voice_notify_reply", "bool", true],
    ["voice_notify_delete_after", "num", 0],
    ["voice_notify_ping", "bool", true],
    ["notify_milestones", "json", "[]"],
    ["voice_notify_milestones", "json", "[]"],
    ["xp_multiplier", "num", 1],
    ["multiplier_mode", "text", "highest"],
    ["multiplier_cap", "num", 20],
    ["vote_boost_enabled", "bool", true],
    ["no_xp_role_ids", "list", []],
    ["no_xp_user_ids", "list", []],
    ["only_xp_role_ids", "list", []],
    ["ignored_category_ids", "list", []],
    ["voice_ignored_category_ids", "list", []],
    ["keep_xp", "bool", false],
    ["restore_roles", "bool", true],
    ["leaderboard_public", "bool", false],
    ["leaderboard_slug", "text", null],
    ["leaderboard_join_url", "text", null]
  ],
  level_rewards: [
    ["level", "num", null],
    ["role_id", "text", null],
    ["source", "text", "text"]
  ],
  level_multipliers: [
    ["target_id", "text", null],
    ["target_type", "text", null],
    ["multiplier", "num", null]
  ],
  milestone_rewards: [
    ["kind", "text", null],
    ["count", "num", null],
    ["role_id", "text", null],
    ["message", "text", null]
  ],
  ticket_settings: [
    ["claim_mode", "text", "shared"],
    ["ping_on_claim", "bool", false],
    ["roles_to_add_on_claim", "list", []],
    ["close_requires_support_role", "bool", false],
    ["close_requires_reason", "bool", false],
    ["hide_closing_user", "bool", false],
    ["dm_user_on_close", "bool", true],
    ["default_close_reason", "text", null],
    ["log_staff_message_counts", "bool", false],
    ["autoclose_leave", "bool", false],
    ["autoclose_inactivity_enabled", "bool", false],
    ["autoclose_inactivity_hours", "num", 168],
    ["rating_enabled", "bool", false],
    ["rating_mode", "text", "rating_only"],
    ["rating_log_channel_id", "text", null],
    ["opened_log_channel_id", "text", null],
    ["closed_log_channel_id", "text", null],
    ["blocked_role_ids", "list", []],
    ["global_limit", "num", 0],
    ["hours_enabled", "bool", false],
    ["hours_timezone", "text", "America/Bogota"],
    ["hours_start", "text", "09:00"],
    ["hours_end", "text", "21:00"],
    ["hours_days", "list", [1, 2, 3, 4, 5]],
    ["hours_block", "bool", false],
    ["hours_message", "text", null],
    ["unclaimed_reminder_minutes", "num", 0],
    ["auto_delete_closed_hours", "num", 0],
    ["transcript_channel_id", "text", null],
    ["transcript_mode", "text", "auto"]
  ],
  ticket_panels: [
    ["channel_id", "text", null],
    ["title", "text", null],
    ["description", "text", null],
    ["embed_template", "text", null],
    ["style", "text", "button"],
    ["color", "num", null],
    ["image_url", "text", null],
    ["footer", "text", null],
    ["placeholder", "text", null]
  ],
  ticket_categories: [
    ["panel_id", "num", null],
    ["key", "text", null],
    ["label", "text", null],
    ["emoji", "text", null],
    ["button_style", "text", "primary"],
    ["description", "text", null],
    ["parent_channel_id", "text", null],
    ["support_role_ids", "list", []],
    ["ping_role_ids", "list", []],
    ["welcome_embed_template", "text", null],
    ["naming_pattern", "text", "ticket-{number}"],
    ["max_open_per_user", "num", 1],
    ["form_id", "num", null],
    ["required_role_ids", "list", []],
    ["welcome_message", "text", null]
  ],
  ticket_forms: [
    ["name", "text", null],
    ["title", "text", "Ticket details"],
    ["fields", "json", "[]"]
  ],
  ticket_replies: [
    ["name", "text", null],
    ["content", "text", null]
  ],
  ticket_blacklist: [
    ["target_type", "text", null],
    ["target_id", "text", null],
    ["reason", "text", null]
  ],
  giveaway_config: [
    ["embed_template", "text", null],
    ["reaction", "text", "🎉"],
    ["entry_mode", "text", "button"],
    ["winner_message", "text", null],
    ["deny_message", "text", null],
    ["claim_time_message", "text", null],
    ["claim_time_over_message", "text", null],
    ["accept_message", "text", null],
    ["no_entries_message", "text", null],
    ["winner_embed_template", "text", null],
    ["deny_embed_template", "text", null],
    ["claim_time_embed_template", "text", null],
    ["claim_time_over_embed_template", "text", null],
    ["accept_embed_template", "text", null],
    ["no_entries_embed_template", "text", null]
  ],
  giveaway_presets: [
    ["name", "text", null],
    ["min_level", "num", 0],
    ["min_voice_level", "num", 0]
  ],
  custom_commands: [
    ["name", "text", null],
    ["response", "text", null],
    ["embed_template", "text", null],
    ["code", "text", null],
    ["trigger_type", "text", "command"],
    ["trigger_text", "text", null]
  ],
  auto_responders: [
    ["ar_id", "text", null],
    ["trigger", "text", null],
    ["reply", "text", null],
    ["match_mode", "text", "contains"],
    ["reply_type", "text", "text"],
    ["delete_trigger", "bool", false],
    ["channel_ids", "list", []],
    ["embed_title", "text", null],
    ["embed_color", "num", null],
    ["embed_footer", "text", null],
    ["embed_template", "text", null],
    ["reply_to_trigger", "bool", false],
    ["role_ids", "list", []],
    ["ping_user", "bool", false],
    ["delete_previous", "bool", false]
  ],
  sticky_messages: [
    ["channel_id", "text", null],
    ["content", "text", null],
    ["embed_template", "text", null]
  ],
  reaction_roles: [
    ["channel_id", "text", null],
    ["emoji", "text", null],
    ["role_id", "text", null],
    ["mode", "text", "toggle"],
    ["interaction_type", "text", "reaction"],
    ["button_label", "text", null],
    ["button_style", "num", null],
    ["button_row", "num", null],
    ["button_position", "num", null]
  ],
  reaction_triggers: [
    ["emoji", "text", null],
    ["trigger", "text", null],
    ["owner_id", "text", null],
    ["match_mode", "text", "contains"],
    ["channel_ids", "list", []],
    ["role_ids", "list", []],
    ["case_sensitive", "bool", false],
    ["cooldown_seconds", "num", 0],
    ["enabled", "bool", true]
  ],
  reaction_message_configs: [
    ["channel_id", "text", null],
    ["emojis", "list", []]
  ],
  disabled_commands: [
    ["command", "text", null],
    ["channel_id", "text", null]
  ],
  command_aliases: [
    ["name", "text", null],
    ["command", "text", null]
  ],
  auto_threads: [
    ["channel_id", "text", null],
    ["name_template", "text", "{user_name}"],
    ["message_text", "text", null],
    ["embed_template", "text", null],
    ["archive_minutes", "num", 60]
  ],
  auto_messages: [
    ["channel_id", "text", null],
    ["interval_ms", "num", null],
    ["message", "text", null],
    ["delete_previous", "bool", false],
    ["embed_template", "text", null],
    ["schedule", "text", "interval"],
    ["at_time", "text", null],
    ["timezone", "text", "UTC"],
    ["weekday", "num", null],
    ["paused", "bool", false]
  ],
  managed_webhooks: [
    ["channel_id", "text", null],
    ["name", "text", null],
    ["default_username", "text", null],
    ["default_avatar_url", "text", null],
    ["default_message", "text", null],
    ["default_embed", "json", null],
    ["enabled", "bool", true]
  ],
  feeds: [
    ["platform", "text", null],
    ["account_id", "text", null],
    ["account_name", "text", null],
    ["account_url", "text", null],
    ["channel_id", "text", null],
    ["types", "list", []],
    ["message", "text", ""],
    ["ping_roles", "list", []],
    ["ping_everyone", "bool", false],
    ["options", "json", "{}"],
    ["filters", "json", "{}"],
    ["enabled", "bool", true]
  ],
  server_counters: [
    ["channel_id", "text", null],
    ["counter_option", "text", null],
    ["channel_type", "text", null],
    ["name_template", "text", "{option}: {value}"],
    ["prefix", "text", ""],
    ["suffix", "text", ""],
    ["parent_id", "text", null],
    ["interval_seconds", "num", 60],
    ["enabled", "bool", true],
    ["number_format", "text", "plain"],
    ["target_id", "text", null],
    ["goal", "num", null],
    ["timezone", "text", null],
    ["rename_times", "json", "[]"],
    ["target", "text", "name"]
  ],
  button_responders: [
    ["name", "text", null],
    ["label", "text", ""],
    ["emoji", "text", null],
    ["style", "text", "secondary"],
    ["reply", "text", ""],
    ["reply_template", "text", null],
    ["give_role_ids", "list", []],
    ["remove_role_ids", "list", []],
    ["required_role_ids", "list", []],
    ["toggle", "bool", false],
    ["delete_message", "bool", false],
    ["react_emoji", "text", null],
    ["send_channel_id", "text", null]
  ],
  voice_configs: [
    ["creator_channel_id", "text", null],
    ["panel_channel_id", "text", null],
    ["category_id", "text", null],
    ["default_limit", "num", 0],
    ["default_name", "text", "{user.name}"],
    ["sync_category_permissions", "bool", false],
    ["access_role_ids", "list", []],
    ["privacy_mode", "text", "public"],
    ["owner_permissions", "list", ["manage_channels", "move_members"]]
  ],
  sticky_roles_config: [
    ["enabled", "bool", false]
  ],
  sender_identities: [
    ["feature", "text", null],
    ["name", "text", null],
    ["avatar_url", "text", null]
  ],
  report_config: [
    ["channel_id", "text", null],
    ["enabled", "bool", false],
    ["anonymous_reporting_enabled", "bool", false],
    ["urgent_role_id", "text", null],
    ["ping_role_id", "text", null],
    ["cooldown_seconds", "num", 60],
    ["daily_limit", "num", 10],
    ["require_reason", "bool", false],
    ["notify_reporter", "bool", true],
    ["auto_thread", "bool", false],
    ["notify_on_claim", "bool", false]
  ],
  booster_role_config: [
    ["base_role_id", "text", null],
    ["role_limit", "num", 1],
    ["share_max", "num", 0],
    ["filtered_words", "list", []],
    ["color_cooldown_ms", "num", 0],
    ["icon_cooldown_ms", "num", 0],
    ["rename_cooldown_ms", "num", 0],
    ["enabled", "bool", true],
    ["allow_gradient", "bool", true],
    ["allow_icon", "bool", true],
    ["on_unboost", "text", "keep"]
  ],
  reputation_config: [
    ["enabled", "bool", true],
    ["cooldown_hours", "num", 24],
    ["giver_role_ids", "list", []],
    ["blocked_role_ids", "list", []],
    ["channel_ids", "list", []],
    ["rewards", "json", "[]"]
  ],
  request_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["staff_role_id", "text", null],
    ["ping_role_id", "text", null],
    ["max_open", "num", 3],
    ["completion_hours", "num", 0],
    ["messages", "json", "{}"],
    ["reminder_hours", "num", 0]
  ],
  profile_config: [
    ["reviews_enabled", "bool", true],
    ["review_channel_id", "text", null],
    ["min_account_days", "num", 0],
    ["min_member_days", "num", 0],
    ["cooldown_minutes", "num", 0],
    ["min_comment", "num", 0],
    ["max_comment", "num", 300]
  ],
  upload_config: [
    ["enabled", "bool", false],
    ["channel_ids", "list", []],
    ["uploader_role_id", "text", null],
    ["welcome", "json", "{}"]
  ],
  partner_config: [
    ["enabled", "bool", false],
    ["channel_ids", "list", []],
    ["manager_role_id", "text", null],
    ["min_members", "num", 0],
    ["min_age_days", "num", 0],
    ["cooldown_days", "num", 0],
    ["keep_original", "bool", true],
    ["react_emoji", "text", null],
    ["messages", "json", "{}"],
    ["cooldown_minutes", "num", 0],
    ["welcome_channel_id", "text", null],
    ["block_nsfw", "bool", false],
    ["blocked_keywords", "list", []],
    ["nickname_format", "text", null]
  ],
  suggestion_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["listen_channel", "bool", false],
    ["allow_command", "bool", true],
    ["up_emoji", "text", "<:Pe_nerdSuccess:1559577139328847963>"],
    ["down_emoji", "text", "<:Pe_nerdError:1559577090586841188>"],
    ["thread", "bool", true],
    ["thread_name", "text", "Thread for suggestion {suggestion.id}"],
    ["self_vote", "bool", true],
    ["dm_author", "bool", true],
    ["anonymous", "bool", false],
    ["staff_role_id", "text", null],
    ["embed_template", "text", null],
    ["status_colors", "bool", true],
    ["color_pending", "num", 16766307],
    ["color_approved", "num", 10873466],
    ["color_denied", "num", 16739179],
    ["color_considering", "num", 16758892],
    ["color_implemented", "num", 16224179]
  ],
  confession_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["review_channel_id", "text", null],
    ["require_review", "bool", false],
    ["allow_command", "bool", true],
    ["allow_images", "bool", true],
    ["allow_replies", "bool", true],
    ["keep_author", "bool", true],
    ["use_webhook", "bool", true],
    ["webhook_name", "text", "Anonymous"],
    ["webhook_avatar", "text", null],
    ["title", "text", "Anonymous confession #{confession.number}"],
    ["footer", "text", "Confession ID: {confession.id}"],
    ["color", "num", 16772761],
    ["button_label", "text", "Confess"],
    ["reply_label", "text", "Reply anonymously"],
    ["panel_text", "text", "Press the button and write it. Nobody will know it was you."],
    ["cooldown_seconds", "num", 60],
    ["staff_role_id", "text", null],
    ["embed_template", "text", null],
    ["panel_channel_id", "text", null],
    ["log_channel_id", "text", null]
  ],
  counting_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["start_number", "num", 0],
    ["allow_double", "bool", false],
    ["math", "bool", true],
    ["reset_on_wrong", "bool", true],
    ["delete_wrong", "bool", false],
    ["announce_edits", "bool", true],
    ["react_ok", "text", "✅"],
    ["react_bad", "text", "❌"],
    ["react_record", "text", "🏆"],
    ["saves_max", "num", 0],
    ["save_every", "num", 100],
    ["milestone_every", "num", 100],
    ["record_every", "num", 100],
    ["wrong_role_id", "text", null],
    ["wrong_role_minutes", "num", 60],
    ["alert_seconds", "num", 30]
  ],
  birthday_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["role_id", "text", null],
    ["message", "text", "{EMOJI} Happy birthday {user}! Have a great day!"],
    ["embed_template", "text", null],
    ["hour", "num", 9],
    ["utc_offset_minutes", "num", -300]
  ],
  quest_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["role_id", "text", null],
    ["style", "text", "card"],
    ["embed_template", "text", null],
    ["reward_kinds", "list", []],
    ["task_kinds", "list", []],
    ["hide_sections", "list", []],
    ["accent_color", "num", null],
    ["expiring_hours", "num", 0],
    ["auto_thread", "bool", false],
    ["thread_name", "text", null],
    ["thread_ping", "bool", false],
    ["thread_archive", "num", 1440],
    ["method_enabled", "bool", false],
    ["method_template", "text", null],
    ["method_text", "text", null],
    ["method_target", "text", "thread"],
    ["method_channel_id", "text", null],
    ["method_ping", "bool", false],
    ["type_templates", "json", "{}"],
    ["method_type_templates", "json", "{}"]
  ],
  rollout_config: [
    ["enabled", "bool", false],
    ["channel_id", "text", null],
    ["role_id", "text", null],
    ["style", "text", "card"],
    ["embed_template", "text", null],
    ["kinds", "list", []],
    ["events", "list", []],
    ["min_change", "num", 0],
    ["include_unrolled", "bool", false],
    ["hide_sections", "list", []],
    ["accent_color", "num", null],
    ["type_templates", "json", "{}"]
  ],
  invite_config: [
    ["fake_days", "num", 3],
    ["quick_leave_minutes", "num", 0],
    ["ignore_bots", "bool", false],
    ["subtract_leaves", "bool", true]
  ],
  invite_rewards: [
    ["invites", "num", null],
    ["role_id", "text", null]
  ],
  stats_config: [
    ["enabled", "bool", true],
    ["members_enabled", "bool", true],
    ["content_enabled", "bool", true]
  ],
  counter_announce_config: [
    ["enabled", "bool", true],
    ["channel_id", "text", null],
    ["message", "text", ""],
    ["embed_name", "text", null],
    ["every", "num", null],
    ["use_goals", "bool", true]
  ],
  starboards: [
    ["channel_id", "text", null],
    ["threshold", "num", 3],
    ["emoji", "text", "⭐"],
    ["selfstar", "bool", false],
    ["color", "num", 16760839],
    ["timestamp", "bool", true],
    ["jumpurl", "bool", true],
    ["attachments", "bool", true],
    ["ignored_channel_ids", "list", []],
    ["ignored_role_ids", "list", []],
    ["ignored_user_ids", "list", []],
    ["embed_template", "text", null],
    ["extra_emojis", "list", []]
  ],
  monkeyboards: [
    ["channel_id", "text", null],
    ["threshold", "num", 3],
    ["emoji", "text", "🐒"],
    ["selfstar", "bool", false],
    ["color", "num", 9132587],
    ["timestamp", "bool", true],
    ["jumpurl", "bool", true],
    ["attachments", "bool", true],
    ["ignored_channel_ids", "list", []],
    ["ignored_role_ids", "list", []],
    ["ignored_user_ids", "list", []],
    ["embed_template", "text", null],
    ["extra_emojis", "list", []]
  ],
  clownboards: [
    ["channel_id", "text", null],
    ["threshold", "num", 3],
    ["emoji", "text", "🤡"],
    ["extra_emojis", "list", []],
    ["selfstar", "bool", false],
    ["color", "num", 15227215],
    ["timestamp", "bool", true],
    ["jumpurl", "bool", true],
    ["attachments", "bool", true],
    ["ignored_channel_ids", "list", []],
    ["ignored_role_ids", "list", []],
    ["ignored_user_ids", "list", []],
    ["embed_template", "text", null]
  ],
  media_only_channels: [
    ["channel_id", "text", null],
    ["attachments_enabled", "bool", false],
    ["links_enabled", "bool", false],
    ["allow_images", "bool", true],
    ["allow_videos", "bool", true],
    ["allow_audio", "bool", false],
    ["allow_files", "bool", false],
    ["networks", "list", []],
    ["allow_caption", "bool", true],
    ["notice", "bool", true],
    ["bypass_role_ids", "list", []]
  ],
  forum_setups: [
    ["name", "text", null],
    ["forum_channel_id", "text", null],
    ["enabled", "bool", true],
    ["panel_channel_id", "text", null],
    ["panel_template", "text", null],
    ["panel_title", "text", null],
    ["panel_description", "text", null],
    ["panel_color", "num", null],
    ["panel_image", "text", null],
    ["panel_footer", "text", null],
    ["button_label", "text", null],
    ["button_emoji", "text", null],
    ["button_style", "text", "success"],
    ["modal_title", "text", null],
    ["title_label", "text", null],
    ["description_label", "text", null],
    ["extra_fields", "json", "[]"],
    ["ask_images", "bool", false],
    ["require_tag", "bool", false],
    ["tag_ids", "list", []],
    ["max_tags", "num", 1],
    ["solved_tag_id", "text", null],
    ["first_message", "text", null],
    ["first_message_style", "text", "plain"],
    ["guidelines", "text", null],
    ["ping_role_ids", "list", []],
    ["slowmode_seconds", "num", 0],
    ["staff_role_ids", "list", []],
    ["required_role_ids", "list", []],
    ["blocked_role_ids", "list", []],
    ["blocked_user_ids", "list", []],
    ["max_open_per_user", "num", 3],
    ["cooldown_seconds", "num", 30],
    ["author_can_close", "bool", true],
    ["author_can_solve", "bool", true],
    ["author_can_rename", "bool", true],
    ["inactive_days", "num", 0],
    ["inactive_action", "text", "close"],
    ["solved_action", "text", "none"],
    ["solved_delay_hours", "num", 24],
    ["adopt", "bool", false],
    ["tag_wait_minutes", "num", 10],
    ["log_events", "list", ["opened", "locked", "closed", "solved"]]
  ],
  vanity_rules: [
    ["name", "text", null],
    ["word", "text", null],
    ["source", "text", null],
    ["comparison", "text", null],
    ["role_id", "text", null],
    ["action", "text", null],
    ["enabled", "bool", true],
    ["priority", "num", 0],
    ["normalization", "json", '{"case_fold":true,"trim_space":true,"collapse_space":true}']
  ],
  guildtag_rules: [
    ["name", "text", null],
    ["condition", "text", null],
    ["value", "text", ""],
    ["role_id", "text", null],
    ["action", "text", null],
    ["enabled", "bool", true],
    ["priority", "num", 0]
  ],
  form_config: [
    ["retention_days", "num", 30]
  ],
  forms: [
    ["name", "text", null],
    ["title", "text", null],
    ["description", "text", null],
    ["color", "num", null],
    ["status", "text", "closed"],
    ["questions", "json", "[]"],
    ["review_channel_id", "text", null],
    ["reviewer_role_ids", "list", []],
    ["ping_role_ids", "list", []],
    ["auto_thread", "bool", false],
    ["required_role_ids", "list", []],
    ["blocked_role_ids", "list", []],
    ["min_account_days", "num", 0],
    ["min_member_days", "num", 0],
    ["one_pending", "bool", true],
    ["deny_cooldown_hours", "num", 0],
    ["max_per_user", "num", 0],
    ["max_total", "num", 0],
    ["closes_at", "time", null],
    ["accept_add_role_ids", "list", []],
    ["accept_remove_role_ids", "list", []],
    ["deny_add_role_ids", "list", []],
    ["deny_remove_role_ids", "list", []],
    ["dm_results", "bool", true],
    ["messages", "json", "{}"],
    ["button_label", "text", null],
    ["button_emoji", "text", null],
    ["button_style", "text", "primary"],
    ["web_enabled", "bool", true],
    ["public_id", "text", null],
    ["page_banner", "text", null],
    ["page_background", "text", "default"],
    ["page_show_icon", "bool", true],
    ["page_show_name", "bool", true],
    ["page_hide_branding", "bool", false],
    ["embed_title", "text", null],
    ["embed_description", "text", null],
    ["embed_image", "text", null],
    ["embed_color", "num", null],
    ["embed_thumbnail", "bool", false]
  ],
  form_panels: [
    ["channel_id", "text", null],
    ["form_ids", "list", []],
    ["style", "text", "buttons"],
    ["template", "text", null],
    ["title", "text", null],
    ["description", "text", null],
    ["color", "num", null]
  ],
  member_events_config: [
    ["welcome_channel_id", "text", null],
    ["welcome_message", "text", null],
    ["welcome_embed_template", "text", null],
    ["leave_channel_id", "text", null],
    ["leave_message", "text", null],
    ["leave_embed_template", "text", null],
    ["boost_channel_id", "text", null],
    ["boost_message", "text", null],
    ["boost_embed_template", "text", null],
    ["boost_level_message", "text", null],
    ["boost_level_embed_template", "text", null],
    ["dm_join_message", "text", null],
    ["dm_join_embed_template", "text", null],
    ["welcome_wait", "text", "off"],
    ["welcome_second_enabled", "bool", false],
    ["welcome_second_channel_id", "text", null],
    ["welcome_second_message", "text", null],
    ["welcome_second_embed_template", "text", null]
  ],
  verification_config: [
    ["enabled", "bool", false],
    ["unverified_role_id", "text", null],
    ["verified_role_id", "text", null],
    ["prompt_embed_template", "text", null],
    ["verified_embed_template", "text", null],
    ["method", "text", "turnstile"],
    ["panel_channel_id", "text", null],
    ["panel_image_url", "text", null]
  ],
  bump_reminders: [
    ["channel_id", "text", null],
    ["message", "text", "It's time to **/bump** the server!"],
    ["thankyou", "text", "{user.mention} successfully bumped! Bump again {nextBump}."],
    ["pingable", "bool", false],
    ["autolock", "bool", false],
    ["autoclean", "bool", false],
    ["thankyou_embed_template", "text", null],
    ["reminder_embed_template", "text", null]
  ],
  poj_config: [
    ["enabled", "bool", true]
  ],
  poj_channels: [
    ["channel_id", "text", null],
    ["delete_after_ms", "num", 5e3]
  ],
  join_roles: [
    ["role_id", "text", null],
    ["target", "text", "all"],
    ["after_rules", "bool", false]
  ],
  embed_templates: [
    ["name", "text", null],
    ["data", "json", "{}"]
  ],
  image_cards: [
    ["name", "text", null],
    ["data", "json", "{}"]
  ]
};

const one = (key, table, about, extra = {}) => ({ key, table, mode: "one", about, ...extra });
const many = (key, table, about, extra = {}) => ({ key, table, mode: "many", about, ...extra });
const SECTIONS = [
  { key: "permissions", about: "Who can use which commands", modules: [
    many("groups", "permission_groups", "Permission groups and their level", { order: "level.desc" }),
    many("command_levels", "command_permission_levels", "The level each command asks for", { order: "command_name.asc" }),
    many("dashboard_access", "dash_access", "Roles that can open parts of this dashboard"),
    many("command_restrictions", "command_restrictions", "Commands limited to a role")
  ] },
  { key: "design", about: "Saved embeds and image cards (their names only)", modules: [
    many("embed_templates", "embed_templates", "Saved embeds", { only: ["name"], order: "name.asc", limit: 200 }),
    // tile
    many("image_cards", "image_cards", "Image cards", { only: ["name"], order: "name.asc", limit: 200 })
    // tile
  ] },
  { key: "moderation", about: "Protection tools", modules: [
    one("automod", "automod_config", "Word filter, spam, raids and new accounts"),
    // tile
    one("antinuke", "antinuke_config", "Anti-nuke and panic mode"),
    // tile
    many("antinuke_rules", "antinuke_rules", "Anti-nuke rules, one per kind of action"),
    one("scam", "scam_config", "Scam and phishing links"),
    many("honeypots", "honeypots", "Bait channels"),
    many("role_triggers", "role_triggers", "What happens to a member who is given a role"),
    one("role_trigger_limits", "role_trigger_settings", "How many actions role triggers may take at once"),
    one("lockdown", "lockdown_config", "Server lockdown"),
    one("jail", "jail_config", "Jail role and channel"),
    many("silent_channels", "automod_silent_channels", "Channels where writing is punished"),
    many("warn_escalation_rules", "warn_escalation_rules", "What the warns add up to", { order: "warn_count.asc" }),
    many("sanction_messages", "sanction_templates", "Texts of the messages that come with a sanction"),
    one("message_links", "message_link_settings", "Previews of links to messages")
  ] },
  { key: "appeals", about: "Appeals of sanctions", modules: [
    one("settings", "appeal_config", "Appeals settings"),
    many("forms", "appeal_forms", "Appeal forms", { order: "name.asc" })
  ] },
  { key: "logging", about: "Which channel gets each kind of event", modules: [
    many("routed_events", "log_entries", "One line per event kind and the channel that gets it", { order: "event.asc" }),
    // tile
    many("ignored", "log_ignored", "Channels, roles and users that are not logged")
  ] },
  { key: "leveling", about: "XP, levels, rewards and the rank card", modules: [
    one("settings", "level_config", "Leveling settings", { flat: true }),
    many("rewards", "level_rewards", "Roles given at a level", { order: "level.asc", limit: 200 }),
    // tile
    many("multipliers", "level_multipliers", "XP multipliers of roles and channels"),
    many("milestone_rewards", "milestone_rewards", "Rewards for milestones")
  ] },
  { key: "automation", about: "Commands, replies, timers and other automatic things", modules: [
    many("custom_commands", "custom_commands", "Custom commands", { order: "name.asc" }),
    // tile
    many("autoresponders", "auto_responders", "Autoresponders"),
    // tile
    many("sticky_messages", "sticky_messages", "Messages pinned to the bottom of a channel"),
    many("reaction_roles", "reaction_roles", "Reaction and button roles"),
    // tile
    many("reaction_triggers", "reaction_triggers", "Words that make the bot react"),
    many("reaction_messages", "reaction_message_configs", "Channels where the bot adds reactions"),
    many("disabled_commands", "disabled_commands", "Commands turned off"),
    many("aliases", "command_aliases", "Command aliases", { order: "name.asc" }),
    many("auto_threads", "auto_threads", "Channels that open a thread for every message"),
    many("timers", "auto_messages", "Repeating timers"),
    // tile
    many("webhooks", "managed_webhooks", "Webhooks made by Petto (their tokens are never shown)"),
    many("feeds", "feeds", "Feeds of other services"),
    // tile
    many("counters", "server_counters", "Live counter channels"),
    many("button_replies", "button_responders", "Buttons that answer or give roles"),
    one("voicemaster", "voice_configs", "Temporary voice channels"),
    one("sticky_roles", "sticky_roles_config", "Give roles back to members who return"),
    many("senders", "sender_identities", "Name and picture used to send messages")
  ] },
  { key: "community", about: "Community features", modules: [
    one("reports", "report_config", "Member reports"),
    one("booster_roles", "booster_role_config", "Roles that boosters make for themselves"),
    one("reputation", "reputation_config", "Reputation points"),
    one("requests", "request_config", "Requests"),
    one("profiles", "profile_config", "Member reviews"),
    one("uploads", "upload_config", "Uploads"),
    one("partners", "partner_config", "Partnerships"),
    one("suggestions", "suggestion_config", "Suggestions"),
    one("confessions", "confession_config", "Anonymous confessions"),
    one("counting", "counting_config", "Counting game"),
    one("birthdays", "birthday_config", "Birthdays"),
    one("quests", "quest_config", "Quest announcements"),
    one("rollouts", "rollout_config", "Rollouts"),
    one("invites", "invite_config", "How invites are counted"),
    many("invite_rewards", "invite_rewards", "Roles given for invites"),
    one("stats", "stats_config", "Server statistics"),
    one("counter_announcements", "counter_announce_config", "Announcements when a counter reaches a goal")
  ] },
  { key: "boards", about: "Boards, media-only channels and forums", modules: [
    many("starboard", "starboards", "Starboard"),
    many("monkeyboard", "monkeyboards", "Monkeyboard"),
    many("clownboard", "clownboards", "Clownboard"),
    many("media_only_channels", "media_only_channels", "Channels that only take media"),
    many("forums", "forum_setups", "Forum setups")
  ] },
  { key: "vanity", about: "Roles given for a word in the profile or a server tag", modules: [
    many("vanity_rules", "vanity_rules", "Rules for words in the profile"),
    many("guild_tag_rules", "guildtag_rules", "Rules for server tags")
  ] },
  { key: "onboarding", about: "Welcome, leave, boost, verification and bump messages", modules: [
    one("member_events", "member_events_config", "Welcome, leave and boost messages", { flat: true }),
    // tile
    one("verification", "verification_config", "Verification"),
    one("bump", "bump_reminders", "Bump reminders"),
    one("ping_on_join", "poj_config", "Ping on join"),
    many("ping_on_join_channels", "poj_channels", "Channels used by ping on join"),
    many("join_roles", "join_roles", "Roles given when someone joins")
  ] },
  { key: "tickets", about: "Tickets", modules: [
    one("settings", "ticket_settings", "Ticket settings"),
    many("panels", "ticket_panels", "Panels"),
    many("support_types", "ticket_categories", "Support types", { order: "label.asc" }),
    // tile
    many("forms", "ticket_forms", "Ticket forms"),
    many("quick_replies", "ticket_replies", "Quick replies", { order: "name.asc" }),
    many("blocklist", "ticket_blacklist", "Members and roles that cannot open tickets")
  ] },
  { key: "giveaways", about: "Giveaways", modules: [
    one("settings", "giveaway_config", "Giveaway settings", { flat: true }),
    { key: "running_now", table: "giveaways", mode: "count", filter: "ended=eq.false", about: "Giveaways running now" },
    many("presets", "giveaway_presets", "Presets", { order: "name.asc" })
  ] },
  { key: "forms", about: "Forms and applications", modules: [
    one("settings", "form_config", "Forms settings"),
    many("forms", "forms", "Forms", { order: "name.asc" }),
    many("panels", "form_panels", "Panels")
  ] }
];
const GUILD_COLUMNS = ["prefix", "prefixes", "mute_role_id", "image_mute_role_id", "reaction_mute_role_id", "language", "setup_channel_id", "bot_nickname", "bot_avatar_url", "bot_banner_url", "bot_description", "bot_name_style", "updated_at"];
const NOTE = {
  enabled: "true turns it on, false turns it off",
  channel_id: "Channel it uses (id)",
  role_id: "Role it uses (id)",
  embed_template: "Name of a saved embed to send",
  message: "Text of the message (variables allowed)",
  action: "What happens to the member",
  threshold: "How many it takes",
  emoji: "Emoji it uses",
  color: "Color of the embed (a number)",
  name: "Name",
  label: "Text on the button or in the list",
  interval_ms: "Time between runs (milliseconds)",
  duration_ms: "How long it lasts (milliseconds)",
  hour: "Hour of the day (0 to 23)",
  sections: "Parts of the form (shortened)",
  messages: "Texts it sends (shortened)",
  // automod
  word_filter_enabled: "true to delete messages with a banned word",
  word_filter_action: "What happens when a banned word is written (warn, mute, kick, delete)",
  banned_words: "Words that are not allowed",
  anti_spam_enabled: "true to stop spam (repeats, mentions, invites, caps)",
  max_mentions: "Most mentions a message may have",
  allowed_invite_codes: "Discord invite codes that are allowed",
  anti_raid_enabled: "true to react when many members join at once",
  raid_join_threshold: "Joins inside the window that count as a raid",
  raid_window_seconds: "Window to count joins (seconds)",
  raid_action: "What happens in a raid (alert, kick, lockdown)",
  immune_role_ids: "Roles the automod never touches (ids)",
  anti_alt_enabled: "true to act on very new accounts",
  anti_alt_min_age_days: "Minimum age of an account (days)",
  anti_alt_action: "What happens to a new account (kick, flag)",
  repeat_threshold: "Repeated messages before the spam rule acts",
  repeat_window_seconds: "Window to count repeated messages (seconds)",
  caps_percent: "Percent of capital letters that counts as shouting",
  caps_min_length: "Shortest message the caps rule looks at",
  max_message_length: "Longest message allowed (0 for no limit)",
  max_lines: "Most lines a message may have (0 for no limit)",
  exempt_channel_ids: "Channels the rule ignores (ids)",
  allowed_link_domains: "Domains that are allowed in links",
  strike_limit: "Strikes before the member is muted (0 for off)",
  strike_window_minutes: "Time strikes are counted for (minutes)",
  strike_mute_minutes: "How long the strike mute lasts (minutes)",
  no_avatar_enabled: "true to act on accounts without a picture",
  no_avatar_action: "What happens to an account without a picture",
  // antinuke
  action_threshold: "Dangerous actions allowed inside the window",
  window_seconds: "Window to count actions (seconds)",
  whitelist_ids: "Members the protection never touches (ids)",
  whitelist_role_ids: "Roles the protection never touches (ids)",
  admin_ids: "Members who may change the protection (ids)",
  owner_only: "true so only the owner can change the protection",
  dm_owner: "true to send the owner a message when it acts",
  panic_enabled: "true to lock the server when many actions happen",
  panic_threshold: "Alerts inside the window that start panic mode",
  panic_window_minutes: "Window to count alerts (minutes)",
  panic_lockdown_minutes: "How long panic mode lasts (minutes)",
  panic_on_raid: "true to start panic mode on a raid",
  alert_channel_id: "Channel that gets the alerts (id)",
  // scam
  timeout_minutes: "How long a timeout lasts (minutes)",
  delete_messages: "true to delete the scam messages",
  delete_minutes: "How far back messages are deleted (minutes)",
  channels_threshold: "Channels the same text is sent to before it counts",
  scan_text: "true to look inside the text of messages",
  scan_new_accounts: "true to be stricter with new accounts",
  new_account_hours: "Age that counts as a new account (hours)",
  dm_user: "true to send the member a message",
  ping_role_id: "Role that is pinged (id)",
  // honeypot
  punishment: "What happens to who writes there (ban, softban, kick)",
  panel_mode: "What the bait channel shows (default, custom, none)",
  panel_text: "Text shown in the bait channel",
  panel_template: "Name of the saved embed shown there",
  dm_member: "true to tell the member why",
  reinvite: "true to send a new invite after a softban",
  // leveling
  xp_min: "Least XP for a message",
  xp_max: "Most XP for a message",
  xp_per_vc_minute: "XP per minute in a voice channel",
  cooldown_seconds: "Time between two rewarded messages (seconds)",
  curve_a: "Level curve, part a",
  curve_b: "Level curve, part b",
  curve_c: "Level curve, part c",
  difficulty: "How hard each level is",
  rounding: "Round the XP of a level to a multiple of this",
  max_level: "Highest level",
  notify_mode: "Where level-up messages go (off, reply, channel, dm)",
  notify_message: "Text of the level-up message",
  notify_every: "Announce every this many levels",
  role_mode: "Keep only the highest reward role, or all of them (highest, all)",
  ignored_channel_ids: "Channels that give no XP (ids)",
  join_xp: "XP given to a new member",
  join_level: "Level given to a new member",
  voice_enabled: "true to give XP for voice",
  rank_style: "How /rank looks (card, embed, both)",
  min_message_chars: "Shortest message that gives XP",
  anti_repeat: "true to give no XP for repeated messages",
  daily_xp_cap: "Most XP a day (0 for no limit)",
  daily_bonus_xp: "XP of the first message of the day",
  streak_bonus_xp: "Extra XP per day of the streak",
  streak_max_days: "Longest streak that adds XP (days)",
  xp_multiplier: "XP multiplier of the whole server",
  multiplier_mode: "How several multipliers combine (highest, stack, sum)",
  multiplier_cap: "Highest total multiplier",
  vote_boost_enabled: "true so voters get extra XP",
  no_xp_role_ids: "Roles that give no XP (ids)",
  no_xp_user_ids: "Members blocked from XP: they earn none and none can be given by hand (ids)",
  only_xp_role_ids: "Only these roles give XP (ids, empty for everyone)",
  keep_xp: "true to keep the XP of a member who leaves (off: it is erased)",
  restore_roles: "true to give reward roles back to a returning member",
  leaderboard_public: "true to share the leaderboard on the website",
  leaderboard_slug: "Address of the public leaderboard",
  // tickets
  claim_mode: "Who can claim a ticket (shared, exclusive)",
  close_requires_reason: "true to ask for a reason to close",
  dm_user_on_close: "true to message the member when the ticket closes",
  default_close_reason: "Reason used when none is given",
  autoclose_inactivity_enabled: "true to close quiet tickets",
  autoclose_inactivity_hours: "Hours without messages before closing",
  rating_enabled: "true to ask for a rating when a ticket closes",
  global_limit: "Most tickets open at once in the server (0 for no limit)",
  hours_enabled: "true to have opening hours",
  hours_timezone: "Time zone of the opening hours",
  hours_start: "Opening time",
  hours_end: "Closing time",
  hours_days: "Days open (0 is Sunday)",
  transcript_channel_id: "Channel that gets the transcripts (id)",
  transcript_mode: "When a transcript is sent (auto and others)",
  naming_pattern: "Name of a ticket channel ({number} is replaced)",
  max_open_per_user: "Most tickets a member may have open",
  support_role_ids: "Roles that answer the ticket (ids)",
  ping_role_ids: "Roles that are pinged (ids)",
  // giveaways
  entry_mode: "How members enter (button or reaction)",
  reaction: "Reaction used to enter",
  min_level: "Lowest level to enter",
  // member events
  welcome_channel_id: "Channel that welcomes new members (id)",
  welcome_message: "Text of the welcome message",
  leave_channel_id: "Channel for goodbyes (id)",
  boost_channel_id: "Channel for boost thank-yous (id)",
  boost_level_message: "Text when the server reaches a boost level",
  dm_join_message: "Direct message sent to new members",
  unverified_role_id: "Role of members who have not verified (id)",
  verified_role_id: "Role given after verifying (id)",
  method: "How members verify",
  thankyou: "Text that thanks the member who bumped",
  pingable: "true to ping the role when it is time to bump",
  // community
  cooldown_hours: "Time between two uses (hours)",
  role_limit: "Most roles a booster can make",
  share_max: "Most members a booster can share the role with",
  filtered_words: "Words that cannot be in a role name",
  staff_role_id: "Staff role (id)",
  up_emoji: "Emoji to vote for",
  down_emoji: "Emoji to vote against",
  start_number: "Number the count starts at",
  allow_double: "true so one member may count twice in a row",
  math: "true to accept math expressions",
  utc_offset_minutes: "Time zone as minutes from UTC",
  fake_days: "Age under which an invited account does not count (days)",
  ignored_role_ids: "Roles that are ignored (ids)",
  ignored_user_ids: "Members that are ignored (ids)",
  selfstar: "true so the author can star their own message",
  attachments: "true to show attachments",
  jumpurl: "true to add a link to the message",
  timestamp: "true to add the time",
  extra_emojis: "More emojis that count (list)",
  comparison: "How the word is compared",
  priority: "Order the rules are checked in",
  normalization: "How text is cleaned before comparing (shortened)",
  match_mode: "How the trigger is matched",
  trigger: "Word or text that starts it",
  reply: "What the bot answers",
  response: "What the bot answers (shortened)",
  code: "Code of the command (shortened)",
  trigger_type: "What starts the command",
  trigger_text: "Text that starts the command",
  channel_ids: "Channels it works in (ids; empty for all)",
  role_ids: "Roles it applies to (ids)",
  case_sensitive: "true to tell capitals apart",
  command: "Command",
  platform: "Service the feed follows",
  account_name: "Account followed",
  types: "Kinds of posts sent",
  ping_roles: "Roles pinged for a post (ids)",
  ping_everyone: "true to ping @everyone for a post",
  schedule: "How often it repeats",
  at_time: "Time of the day",
  timezone: "Time zone",
  weekday: "Day of the week (0 is Sunday)",
  paused: "true while paused",
  delete_previous: "true to delete the one sent before",
  counter_option: "What the counter shows",
  name_template: "Name of the channel ({count} is replaced)",
  interval_seconds: "Time between updates (seconds)",
  creator_channel_id: "Voice channel that makes a new one when joined (id)",
  category_id: "Category where new channels go (id)",
  default_limit: "People allowed in a new channel (0 for no limit)",
  default_name: "Name of a new channel",
  slug: "Address on the website",
  default_username: "Name the webhook posts with",
  default_message: "Text the webhook sends by default",
  panel_channel_id: "Channel where the panel is posted (id)",
  review_channel_id: "Channel where staff review (id)",
  log_channel_id: "Channel that gets the log (id)",
  submission_channel_id: "Channel that gets the submissions (id)",
  retention_days: "Days answers are kept",
  mode: "Kind of reaction role (reaction or button)",
  button_label: "Text of the button",
  button_style: "Color of the button",
  required_role_ids: "Roles needed to use it (ids)",
  blocked_role_ids: "Roles that cannot use it (ids)",
  one_pending: "true to allow only one pending application per member",
  web_enabled: "true to fill it in on the website",
  closes_at: "When it closes",
  status: "State (open, closed...)",
  questions: "Questions (shortened)",
  fields: "Fields (shortened)",
  data: "Data (shortened)"
};
const UNIT = [[/_seconds$/, "seconds"], [/_minutes$/, "minutes"], [/_hours$/, "hours"], [/_days$/, "days"], [/_ms$/, "milliseconds"], [/_percent$/, "percent"]];
function words(col) {
  const text = col.replace(/_ids?$/, "").replace(/_/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : col;
}
function noteOf(col, kind) {
  if (NOTE[col]) return NOTE[col];
  const w = words(col);
  if (/_role_ids$/.test(col)) return `${w} roles (ids)`;
  if (/_role_id$/.test(col)) return `${w} role (id)`;
  if (/_channel_ids$/.test(col)) return `${w} channels (ids)`;
  if (/_channel_id$/.test(col)) return `${w} channel (id)`;
  if (/_category_ids?$/.test(col)) return `${w} categories (ids)`;
  if (/_user_ids$/.test(col)) return `${w} members (ids)`;
  if (/_template$/.test(col)) return `${w}: name of a saved embed`;
  if (/_message$/.test(col)) return `${w} text (variables allowed)`;
  if (/_ids$/.test(col)) return `${w} (ids)`;
  for (const [re, unit] of UNIT) if (re.test(col)) return `${w} (${unit})`;
  if (kind === "bool") return `${w}: true or false`;
  if (kind === "json") return `${w} (shortened)`;
  return w;
}
const TEXT_MAX = 200;
const LIST_MAX = 200;
function cut(text, max = TEXT_MAX) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
function quote(text) {
  if (/[\u0000-\u001f\u007f-\u009f\u2028\u2029\ufeff]/.test(text)) return JSON.stringify(text).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\ufeff/g, "\\ufeff").replace(/\u007f/g, "\\u007f");
  return `'${text.replace(/'/g, "''")}'`;
}
function oneLine(text) {
  return text.replace(/\r\n|\r|\n/g, " ").replace(/\s+/g, " ").trim();
}
function scalar(kind, value, fallback) {
  let v = value === void 0 ? fallback : value;
  if (kind === "list") {
    if (v === null || v === void 0) return { text: "[]" };
    const items = Array.isArray(v) ? v : [];
    const shown = items.slice(0, LIST_MAX).map((x) => typeof x === "number" && Number.isFinite(x) ? String(x) : quote(cut(oneLine(String(x)), 120)));
    return { text: `[${shown.join(", ")}]`, note: items.length > LIST_MAX ? `${LIST_MAX} of ${items.length} shown` : void 0 };
  }
  if (v === null || v === void 0) return { text: "null" };
  if (kind === "bool") return { text: v === true || v === "t" || v === "true" ? "true" : "false" };
  if (kind === "num") {
    const n = typeof v === "number" ? v : Number(v);
    return { text: Number.isFinite(n) ? String(n) : "null" };
  }
  if (kind === "json") {
    if (typeof v !== "string") {
      try {
        v = JSON.stringify(v);
      } catch {
        v = "";
      }
    }
    return { text: quote(cut(oneLine(String(v)))) };
  }
  if (typeof v === "object") {
    try {
      v = JSON.stringify(v);
    } catch {
      v = "";
    }
  }
  const text = String(v);
  const short = cut(text);
  return { text: /[\r\n]/.test(short) ? quote(short.replace(/\r\n?/g, "\n")) : quote(short) };
}
function empty(kind, value) {
  if (value === null || value === void 0 || value === "") return true;
  if (kind === "list") return !Array.isArray(value) || value.length === 0;
  return false;
}
const COMMENT_AT = 46;
function line(indent, body, note) {
  const left = `${" ".repeat(indent)}${body}`;
  if (!note) return left;
  return `${left}${" ".repeat(Math.max(2, COMMENT_AT - left.length))}# ${oneLine(note)}`;
}
function columnsOf(module) {
  const all = CONFIG_SCHEMA[module.table] ?? [];
  return module.only ? all.filter(([name]) => module.only.includes(name)) : all;
}
function renderOne(mod, data, indent) {
  const out = [];
  const columns = columnsOf(mod);
  const row = data?.rows ? data.rows[0] ?? {} : null;
  let at = indent;
  if (!mod.flat) {
    out.push(row ? line(indent, `${mod.key}:`, mod.about) : line(indent, `${mod.key}: null`, `${mod.about} (not available yet)`));
    at = indent + 2;
  } else if (!row) {
    out.push(line(indent, `# ${mod.about}: not available yet`));
  }
  if (!row) return out;
  for (const [name, kind, fallback] of columns) {
    const { text, note } = scalar(kind, row[name], fallback);
    out.push(line(at, `${name}: ${text}`, note ? `${noteOf(name, kind)} (${note})` : noteOf(name, kind)));
  }
  return out;
}
function renderMany(mod, data, indent) {
  const out = [];
  const rows = data?.rows ?? null;
  if (!rows) {
    out.push(line(indent, `${mod.key}_count: null`, `${mod.about} (not available yet)`));
    out.push(line(indent, `${mod.key}: null`));
    return out;
  }
  const total = data?.total ?? rows.length;
  out.push(line(indent, `${mod.key}_count: ${total}`, mod.about));
  if (!rows.length) {
    out.push(line(indent, `${mod.key}: []`));
    return out;
  }
  const columns = columnsOf(mod);
  out.push(line(indent, `${mod.key}:`, total > rows.length ? `${rows.length} of ${total} shown` : void 0));
  for (const row of rows) {
    const shown = columns.filter(([name, kind], i) => i === 0 || !empty(kind, row[name]));
    shown.forEach(([name, kind, fallback], i) => {
      const { text } = scalar(kind, row[name], fallback);
      out.push(`${" ".repeat(indent + 2)}${i === 0 ? "- " : "  "}${name}: ${text}`);
    });
    if (!shown.length) out.push(`${" ".repeat(indent + 2)}- {}`);
  }
  return out;
}
function renderCount(mod, data, indent) {
  const total = data?.rows ? data.total ?? data.rows.length : null;
  return [line(indent, `${mod.key}: ${total === null ? "null" : total}`, total === null ? `${mod.about} (not available yet)` : mod.about)];
}
const BANNER = [
  "  ██████╗ ███████╗████████╗████████╗ ██████╗ ",
  "  ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔═══██╗",
  "  ██████╔╝█████╗     ██║      ██║   ██║   ██║",
  "  ██╔═══╝ ██╔══╝     ██║      ██║   ██║   ██║",
  "  ██║     ███████╗   ██║      ██║   ╚██████╔╝",
  "  ╚═╝     ╚══════╝   ╚═╝      ╚═╝    ╚═════╝ "
].map((l) => `#${l}`).join("\n");
function renderConfigYaml(input) {
  const g = input.guild;
  const val = (name, kind, fallback) => scalar(kind, g?.[name], fallback).text;
  const lines = [
    BANNER,
    "#",
    `#   This is a read-only snapshot of the configuration of the server: ${oneLine(input.guildName)}. To change a setting, use its own page of the dashboard.`,
    "#   Every setting is here, even the ones you never touched: they show their real default (0, false, null or []).",
    "#",
    "#   How to read it:",
    "#     - A line is   setting: value   # what it does",
    "#     - Ids of channels, roles and members are quoted text, like '668827416747048962'.",
    "#     - A list is written ['a', 'b']. Several items (commands, rewards...) start with a dash and also have a <name>_count line.",
    "#     - Long texts are shortened. Tokens, webhook links and other secrets are never written here.",
    '#     - null means "not set". "not available yet" means the part could not be read right now.',
    "",
    `guild_id: ${quote(input.guildId)}`,
    line(0, `language: ${val("language", "text", "en")}`, "Language of the answers of the bot in this server"),
    line(0, `prefix: ${val("prefix", "text", "!")}`, "Prefix of the commands written as messages"),
    line(0, `prefixes: ${val("prefixes", "list", [])}`, "More prefixes that also work"),
    line(0, `mute_role_id: ${val("mute_role_id", "text", null)}`, "Role given by a mute (id)"),
    line(0, `image_mute_role_id: ${val("image_mute_role_id", "text", null)}`, "Role that stops pictures and files (id)"),
    line(0, `reaction_mute_role_id: ${val("reaction_mute_role_id", "text", null)}`, "Role that stops reactions (id)"),
    line(0, `setup_channel_id: ${val("setup_channel_id", "text", null)}`, "Channel where the bot first answered (id)"),
    "",
    line(0, "bot_profile:", "Set from the Customize page"),
    `  nickname: ${val("bot_nickname", "text", null)}`,
    `  avatar_url: ${val("bot_avatar_url", "text", null)}`,
    `  banner_url: ${val("bot_banner_url", "text", null)}`,
    `  description: ${val("bot_description", "text", null)}`,
    `  name_style: ${val("bot_name_style", "json", null)}`
  ];
  for (const section of SECTIONS) {
    lines.push("", line(0, `${section.key}:`, section.about));
    for (const mod of section.modules) {
      const data = input.data[`${section.key}.${mod.key}`];
      const part = mod.mode === "one" ? renderOne(mod, data, 2) : mod.mode === "many" ? renderMany(mod, data, 2) : renderCount(mod, data, 2);
      lines.push(...mod.flat ? part.map((l) => l) : part);
    }
  }
  lines.push("", `updated_at: ${val("updated_at", "time", null)}`, "");
  return lines.join("\n");
}

export { CONFIG_SCHEMA as C, GUILD_COLUMNS as G, SECTIONS as S, columnsOf as c, renderConfigYaml as r };
