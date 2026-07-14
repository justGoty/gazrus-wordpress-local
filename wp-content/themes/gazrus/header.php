<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
    <div class="wrap header-inner">
        <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
            <span class="brand-mark" aria-hidden="true">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/logo-mark.svg'); ?>" alt="" width="36" height="36">
            </span>
            <span class="brand-text">Газоанализатор<span class="brand-domain">.рус</span></span>
        </a>
        <nav class="nav" aria-label="Главное меню">
            <?php gazrus_primary_nav(); ?>
        </nav>
        <a class="btn btn-small" href="<?php echo esc_url(home_url('/contacts/')); ?>">Получить подбор</a>
    </div>
</header>
