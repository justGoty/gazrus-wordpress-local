<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    register_nav_menus([
        'primary' => 'Главное меню',
        'footer' => 'Меню в подвале',
    ]);
});

add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style('gazrus-style', get_stylesheet_uri(), [], '0.3.6');
    wp_enqueue_script('gazrus-hero-slider', get_template_directory_uri() . '/assets/js/hero-slider.js', [], '0.3.6', true);

    if (get_query_var('gazrus_calculator') || is_page('calculator')) {
        wp_enqueue_script('gazrus-gas-calculator', get_template_directory_uri() . '/assets/js/gas-calculator.js', [], '0.3.6', true);
    }
});

add_filter('query_vars', function (array $vars): array {
    $vars[] = 'gazrus_calculator';
    return $vars;
});

add_action('parse_request', function (WP $wp): void {
    if (trim($wp->request, '/') === 'calculator') {
        $wp->query_vars['gazrus_calculator'] = 1;
    }
});

add_filter('template_include', function (string $template): string {
    if (get_query_var('gazrus_calculator')) {
        status_header(200);
        return get_template_directory() . '/page-calculator.php';
    }
    return $template;
});

function gazrus_asset_image(int $post_id, string $size = 'large'): string
{
    $thumb = get_the_post_thumbnail_url($post_id, $size);
    if ($thumb) {
        return $thumb;
    }
    $legacy = get_post_meta($post_id, '_gazrus_image_url', true);
    return $legacy ?: '';
}

function gazrus_price(int $post_id): string
{
    $price = trim((string) get_post_meta($post_id, '_gazrus_price', true));
    if ($price === '') {
        return 'Цена по запросу';
    }
    return is_numeric($price) ? number_format((float) $price, 0, ',', ' ') . ' ₽' : $price;
}

function gazrus_primary_nav(): void
{
    $items = [
        '/category/' => 'Каталог',
        '/type/stacionarnye-gazoanalizatory/' => 'Стационарные',
        '/type/portativnye-gazoanalizatory/' => 'Портативные',
        '/gas/' => 'Газы',
        '/calculator/' => 'Конвертер',
        '/services/' => 'Услуги',
        '/contacts/' => 'Контакты',
    ];
    foreach ($items as $href => $label) {
        echo '<a href="' . esc_url(home_url($href)) . '">' . esc_html($label) . '</a>';
    }
}

function gazrus_terms(string $taxonomy, int $limit = 20): array
{
    $terms = get_terms([
        'taxonomy' => $taxonomy,
        'hide_empty' => false,
        'number' => $limit,
    ]);
    return is_wp_error($terms) ? [] : $terms;
}

function gazrus_term_cards(string $taxonomy, int $limit = 12): void
{
    $terms = gazrus_terms($taxonomy, $limit);
    if (!$terms) {
        echo '<article class="card"><h3>Раздел готовится</h3><p>Скоро здесь появятся варианты для подбора оборудования.</p></article>';
        return;
    }

    foreach ($terms as $term) {
        echo '<a class="card card-link" href="' . esc_url(get_term_link($term)) . '">';
        echo '<span class="eyebrow">' . esc_html(gazrus_tax_label($taxonomy)) . '</span>';
        echo '<h3>' . esc_html($term->name) . '</h3>';
        echo '<p>' . esc_html(wp_trim_words($term->description ?: gazrus_default_term_text($term), 24)) . '</p>';
        echo '</a>';
    }
}

function gazrus_tax_label(string $taxonomy): string
{
    return match ($taxonomy) {
        'gaz_product_type' => 'Тип прибора',
        'gaz_channel' => 'Канальность',
        'gaz_gas' => 'Газ',
        'gaz_sensor' => 'Сенсор',
        'gaz_brand' => 'Бренд',
        'gaz_explosion' => 'Исполнение',
        default => 'Раздел',
    };
}

function gazrus_default_term_text(WP_Term $term): string
{
    return match ($term->taxonomy) {
        'gaz_gas' => "Подбор газоанализаторов для контроля {$term->name}: тип сенсора, диапазон, канальность и исполнение.",
        'gaz_channel' => "Подбор оборудования по канальности для контроля одного или нескольких газов.",
        'gaz_product_type' => "Поставка и подбор оборудования этого типа под условия объекта.",
        'gaz_sensor' => "Подбор прибора с подходящим типом сенсора под контролируемый газ.",
        default => "Поможем подобрать решение под техническое задание.",
    };
}
