<?php
/**
 * Plugin Name: Gazrus Core
 * Description: Content model, SEO fields, catalog attributes, and staging safeguards for Gazrus WordPress migration.
 * Version: 0.2.0
 * Author: PRS
 */

if (!defined('ABSPATH')) {
    exit;
}

const GAZRUS_CORE_VERSION = '0.2.0';

add_action('init', 'gazrus_register_content_model');
add_action('init', 'gazrus_register_meta_fields');
add_action('add_meta_boxes', 'gazrus_add_meta_boxes');
add_action('save_post', 'gazrus_save_meta_boxes');
add_action('wp_head', 'gazrus_render_seo_meta', 1);
add_action('wp_head', 'gazrus_render_schema', 20);
add_action('send_headers', 'gazrus_staging_noindex_headers');
add_action('init', 'gazrus_handle_request_form');
add_filter('robots_txt', 'gazrus_staging_robots_txt', 10, 2);
add_filter('pre_get_document_title', 'gazrus_document_title');
add_shortcode('gazrus_request_form', 'gazrus_request_form_shortcode');

function gazrus_register_content_model(): void
{
    register_post_type('gaz_product', [
        'labels' => [
            'name' => 'Оборудование',
            'singular_name' => 'Газоанализатор',
            'add_new_item' => 'Добавить оборудование',
            'edit_item' => 'Редактировать оборудование',
            'menu_name' => 'Оборудование',
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-filter',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
        'has_archive' => 'category',
        'rewrite' => ['slug' => 'product', 'with_front' => false],
    ]);

    register_post_type('gaz_service', [
        'labels' => [
            'name' => 'Услуги',
            'singular_name' => 'Услуга',
            'add_new_item' => 'Добавить услугу',
            'edit_item' => 'Редактировать услугу',
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-hammer',
        'supports' => ['title', 'editor', 'excerpt', 'revisions', 'page-attributes'],
        'has_archive' => 'services',
        'rewrite' => ['slug' => 'services', 'with_front' => false],
    ]);

    gazrus_register_taxonomy('gaz_product_category', 'Направления', 'Направление', ['gaz_product'], 'category');
    gazrus_register_taxonomy('gaz_product_type', 'Тип прибора', 'Тип прибора', ['gaz_product'], 'type');
    gazrus_register_taxonomy('gaz_channel', 'Канальность', 'Канальность', ['gaz_product'], 'channel');
    gazrus_register_taxonomy('gaz_gas', 'Контролируемые газы', 'Контролируемый газ', ['gaz_product'], 'gas');
    gazrus_register_taxonomy('gaz_sensor', 'Типы сенсоров', 'Тип сенсора', ['gaz_product'], 'sensor');
    gazrus_register_taxonomy('gaz_brand', 'Бренды', 'Бренд', ['gaz_product'], 'brand');
    gazrus_register_taxonomy('gaz_explosion', 'Исполнение', 'Исполнение', ['gaz_product'], 'execution');
}

function gazrus_register_taxonomy(string $taxonomy, string $plural, string $singular, array $post_types, string $slug): void
{
    register_taxonomy($taxonomy, $post_types, [
        'labels' => [
            'name' => $plural,
            'singular_name' => $singular,
            'add_new_item' => "Добавить: {$singular}",
            'edit_item' => "Редактировать: {$singular}",
            'search_items' => "Искать: {$plural}",
        ],
        'public' => true,
        'hierarchical' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => $slug, 'with_front' => false],
    ]);
}

function gazrus_register_meta_fields(): void
{
    $post_types = ['post', 'page', 'gaz_product', 'gaz_service'];
    $fields = [
        '_gazrus_seo_title' => ['type' => 'string', 'sanitize' => 'sanitize_text_field'],
        '_gazrus_seo_description' => ['type' => 'string', 'sanitize' => 'sanitize_text_field'],
        '_gazrus_legacy_url' => ['type' => 'string', 'sanitize' => 'sanitize_text_field'],
    ];

    foreach ($post_types as $post_type) {
        foreach ($fields as $key => $field) {
            register_post_meta($post_type, $key, [
                'type' => $field['type'],
                'single' => true,
                'show_in_rest' => true,
                'sanitize_callback' => $field['sanitize'],
                'auth_callback' => fn() => current_user_can('edit_posts'),
            ]);
        }
    }

    $product_fields = [
        '_gazrus_price' => 'sanitize_text_field',
        '_gazrus_image_url' => 'esc_url_raw',
        '_gazrus_specs' => 'wp_kses_post',
        '_gazrus_range' => 'sanitize_text_field',
        '_gazrus_channel_count' => 'sanitize_text_field',
        '_gazrus_sensor_note' => 'sanitize_text_field',
        '_gazrus_outputs' => 'sanitize_text_field',
        '_gazrus_protection' => 'sanitize_text_field',
        '_gazrus_verification' => 'sanitize_text_field',
        '_gazrus_documents' => 'wp_kses_post',
    ];

    foreach ($product_fields as $key => $sanitize) {
        register_post_meta('gaz_product', $key, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => $sanitize,
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
}

function gazrus_add_meta_boxes(): void
{
    foreach (['post', 'page', 'gaz_product', 'gaz_service'] as $post_type) {
        add_meta_box('gazrus_seo', 'SEO Газоанализатор.рус', 'gazrus_render_seo_box', $post_type, 'normal', 'default');
    }

    add_meta_box('gazrus_product_data', 'Технические данные оборудования', 'gazrus_render_product_box', 'gaz_product', 'normal', 'high');
}

function gazrus_render_seo_box(WP_Post $post): void
{
    wp_nonce_field('gazrus_save_meta', 'gazrus_meta_nonce');
    $seo_title = get_post_meta($post->ID, '_gazrus_seo_title', true);
    $seo_description = get_post_meta($post->ID, '_gazrus_seo_description', true);
    $legacy_url = get_post_meta($post->ID, '_gazrus_legacy_url', true);
    ?>
    <p>
        <label for="gazrus_seo_title"><strong>SEO title</strong></label>
        <input class="widefat" id="gazrus_seo_title" name="gazrus_seo_title" value="<?php echo esc_attr($seo_title); ?>" maxlength="255">
    </p>
    <p>
        <label for="gazrus_seo_description"><strong>Meta description</strong></label>
        <textarea class="widefat" id="gazrus_seo_description" name="gazrus_seo_description" rows="3" maxlength="320"><?php echo esc_textarea($seo_description); ?></textarea>
    </p>
    <p>
        <label for="gazrus_legacy_url"><strong>Старый URL для карты редиректов</strong></label>
        <input class="widefat" id="gazrus_legacy_url" name="gazrus_legacy_url" value="<?php echo esc_attr($legacy_url); ?>" placeholder="/old-url">
    </p>
    <?php
}

function gazrus_render_product_box(WP_Post $post): void
{
    $fields = [
        'gazrus_price' => ['_gazrus_price', 'Цена / статус', 'Цена по запросу'],
        'gazrus_image_url' => ['_gazrus_image_url', 'URL изображения', 'https://...'],
        'gazrus_range' => ['_gazrus_range', 'Диапазон измерений', '0-100 ppm'],
        'gazrus_channel_count' => ['_gazrus_channel_count', 'Количество каналов', '1 / 2 / 4 / многоканальный'],
        'gazrus_sensor_note' => ['_gazrus_sensor_note', 'Сенсоры и газы', 'CO, H2S, O2; электрохимический сенсор'],
        'gazrus_outputs' => ['_gazrus_outputs', 'Выходы и интерфейсы', '4-20 мА, RS-485, реле'],
        'gazrus_protection' => ['_gazrus_protection', 'Исполнение / защита', 'IP65, Ex...'],
        'gazrus_verification' => ['_gazrus_verification', 'Поверка / документы', 'Поверка, паспорт, руководство'],
    ];

    foreach ($fields as $input => [$meta_key, $label, $placeholder]) {
        $value = get_post_meta($post->ID, $meta_key, true);
        ?>
        <p>
            <label for="<?php echo esc_attr($input); ?>"><strong><?php echo esc_html($label); ?></strong></label>
            <input class="widefat" id="<?php echo esc_attr($input); ?>" name="<?php echo esc_attr($input); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($placeholder); ?>">
        </p>
        <?php
    }

    $specs = get_post_meta($post->ID, '_gazrus_specs', true);
    $documents = get_post_meta($post->ID, '_gazrus_documents', true);
    ?>
    <p>
        <label for="gazrus_specs"><strong>Характеристики</strong></label>
        <textarea class="widefat" id="gazrus_specs" name="gazrus_specs" rows="8" placeholder="Название: значение"><?php echo esc_textarea($specs); ?></textarea>
    </p>
    <p>
        <label for="gazrus_documents"><strong>Документы</strong></label>
        <textarea class="widefat" id="gazrus_documents" name="gazrus_documents" rows="4" placeholder="Паспорт, руководство, сертификат, методика поверки"><?php echo esc_textarea($documents); ?></textarea>
    </p>
    <?php
}

function gazrus_save_meta_boxes(int $post_id): void
{
    if (!isset($_POST['gazrus_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['gazrus_meta_nonce'])), 'gazrus_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = [
        'gazrus_seo_title' => ['_gazrus_seo_title', 'sanitize_text_field'],
        'gazrus_seo_description' => ['_gazrus_seo_description', 'sanitize_text_field'],
        'gazrus_legacy_url' => ['_gazrus_legacy_url', 'sanitize_text_field'],
        'gazrus_price' => ['_gazrus_price', 'sanitize_text_field'],
        'gazrus_image_url' => ['_gazrus_image_url', 'esc_url_raw'],
        'gazrus_specs' => ['_gazrus_specs', 'wp_kses_post'],
        'gazrus_range' => ['_gazrus_range', 'sanitize_text_field'],
        'gazrus_channel_count' => ['_gazrus_channel_count', 'sanitize_text_field'],
        'gazrus_sensor_note' => ['_gazrus_sensor_note', 'sanitize_text_field'],
        'gazrus_outputs' => ['_gazrus_outputs', 'sanitize_text_field'],
        'gazrus_protection' => ['_gazrus_protection', 'sanitize_text_field'],
        'gazrus_verification' => ['_gazrus_verification', 'sanitize_text_field'],
        'gazrus_documents' => ['_gazrus_documents', 'wp_kses_post'],
    ];

    foreach ($fields as $input => [$meta_key, $sanitize]) {
        if (array_key_exists($input, $_POST)) {
            $value = $sanitize(wp_unslash($_POST[$input]));
            update_post_meta($post_id, $meta_key, $value);
        }
    }
}

function gazrus_render_seo_meta(): void
{
    if (is_admin()) {
        return;
    }

    $title = '';
    $description = '';

    if (is_singular()) {
        $post_id = get_queried_object_id();
        $title = (string) get_post_meta($post_id, '_gazrus_seo_title', true);
        $description = (string) get_post_meta($post_id, '_gazrus_seo_description', true);
    } elseif (is_front_page()) {
        $title = 'Поставка и подбор промышленных газоанализаторов | Газоанализатор.рус';
        $description = 'Подбор и поставка промышленных газоанализаторов, датчиков газа, сенсоров и комплектующих. Стационарные и портативные решения по газу, канальности и исполнению.';
    } elseif (is_tax()) {
        $term = get_queried_object();
        if ($term instanceof WP_Term) {
            $title = gazrus_tax_seo_title($term);
            $description = gazrus_tax_seo_description($term);
        }
    } elseif (is_post_type_archive('gaz_product')) {
        $title = 'Каталог газоанализаторов: подбор и поставка | Газоанализатор.рус';
        $description = 'Каталог направлений: стационарные и портативные газоанализаторы, канальность, контролируемые газы, сенсоры и исполнение. Поможем подобрать оборудование под задачу.';
    }

    if (!$title) {
        $title = wp_get_document_title();
    }
    if (!$description) {
        $description = get_bloginfo('description') ?: 'Поставка и подбор промышленных газоанализаторов, датчиков газа, сенсоров и комплектующих.';
    }

    $canonical = gazrus_canonical_url();
    echo '<meta name="description" content="' . esc_attr(gazrus_trim_meta($description)) . '">' . "\n";
    echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta property="og:description" content="' . esc_attr(gazrus_trim_meta($description)) . '">' . "\n";
    echo '<meta property="og:type" content="' . (is_singular() ? 'article' : 'website') . '">' . "\n";
}

function gazrus_document_title(string $title): string
{
    if (is_admin()) {
        return $title;
    }

    if (is_front_page()) {
        return 'Поставка и подбор промышленных газоанализаторов | Газоанализатор.рус';
    }

    if (is_singular()) {
        $custom = (string) get_post_meta(get_queried_object_id(), '_gazrus_seo_title', true);
        return $custom ?: $title;
    }

    if (is_tax()) {
        $term = get_queried_object();
        if ($term instanceof WP_Term) {
            return gazrus_tax_seo_title($term);
        }
    }

    if (is_post_type_archive('gaz_product')) {
        return 'Каталог газоанализаторов: подбор и поставка | Газоанализатор.рус';
    }

    return $title;
}

function gazrus_tax_seo_title(WP_Term $term): string
{
    $suffix = ' | Газоанализатор.рус';
    return match ($term->taxonomy) {
        'gaz_product_type' => $term->name . ': подбор и поставка' . $suffix,
        'gaz_channel' => $term->name . ' газоанализаторы: подбор по канальности' . $suffix,
        'gaz_gas' => 'Газоанализаторы ' . $term->name . ': подбор по контролируемому газу' . $suffix,
        'gaz_sensor' => $term->name . ': газоанализаторы с подходящим типом сенсора' . $suffix,
        default => $term->name . $suffix,
    };
}

function gazrus_tax_seo_description(WP_Term $term): string
{
    if ($term->description) {
        return wp_strip_all_tags($term->description);
    }
    return match ($term->taxonomy) {
        'gaz_gas' => "Подбор и поставка газоанализаторов для контроля {$term->name}. Уточним диапазон измерений, тип сенсора, канальность, исполнение и требования к документам.",
        'gaz_channel' => "Подбор {$term->name} газоанализаторов под задачу объекта: контролируемые газы, диапазоны измерений, исполнение, сигнализация и документы.",
        'gaz_product_type' => "Поставка и подбор оборудования по типу прибора: {$term->name}. Поможем выбрать газоанализатор под объект, газ и условия эксплуатации.",
        default => "Поставка и подбор газоанализаторов по направлению {$term->name}.",
    };
}

function gazrus_canonical_url(): string
{
    if (is_singular()) {
        return get_permalink();
    }

    $queried = get_queried_object();
    if ($queried instanceof WP_Term) {
        return get_term_link($queried);
    }

    if (is_post_type_archive('gaz_product')) {
        return get_post_type_archive_link('gaz_product') ?: home_url('/category/');
    }

    return home_url(add_query_arg([], $GLOBALS['wp']->request ?? ''));
}

function gazrus_render_schema(): void
{
    if (is_admin()) {
        return;
    }

    $schema = [
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'Organization',
                '@id' => home_url('/#organization'),
                'name' => 'Газоанализатор.рус',
                'url' => home_url('/'),
                'telephone' => '+7 495 748-62-58',
                'email' => 'info@prscom.ru',
            ],
            [
                '@type' => 'WebSite',
                '@id' => home_url('/#website'),
                'url' => home_url('/'),
                'name' => 'Газоанализатор.рус',
                'publisher' => ['@id' => home_url('/#organization')],
            ],
        ],
    ];

    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}

function gazrus_handle_request_form(): void
{
    if (empty($_POST['gazrus_request_form'])) {
        return;
    }
    if (!isset($_POST['gazrus_request_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['gazrus_request_nonce'])), 'gazrus_request_form')) {
        return;
    }
    if (!empty($_POST['gazrus_company_site'])) {
        return;
    }

    $name = sanitize_text_field(wp_unslash($_POST['gazrus_name'] ?? ''));
    $contact = sanitize_text_field(wp_unslash($_POST['gazrus_contact'] ?? ''));
    $gas = sanitize_text_field(wp_unslash($_POST['gazrus_gas'] ?? ''));
    $device_type = sanitize_text_field(wp_unslash($_POST['gazrus_device_type'] ?? ''));
    $message = sanitize_textarea_field(wp_unslash($_POST['gazrus_message'] ?? ''));

    $body = "Новая заявка с сайта Газоанализатор.рус\n\n"
        . "Имя: {$name}\n"
        . "Контакт: {$contact}\n"
        . "Газ: {$gas}\n"
        . "Тип прибора: {$device_type}\n"
        . "Задача:\n{$message}\n";

    wp_mail(get_option('admin_email'), 'Заявка на подбор газоанализатора', $body);

    wp_safe_redirect('/contacts/?gazrus_sent=1', 303);
    exit;
}

function gazrus_request_form_shortcode(): string
{
    ob_start();
    if (isset($_GET['gazrus_sent'])) {
        echo '<div class="form-success">Заявка отправлена. Мы свяжемся с вами по указанному контакту.</div>';
    }
    ?>
    <form class="request-form" method="post">
        <?php wp_nonce_field('gazrus_request_form', 'gazrus_request_nonce'); ?>
        <input type="hidden" name="gazrus_request_form" value="1">
        <label>Имя
            <input name="gazrus_name" autocomplete="name" required>
        </label>
        <label>Телефон или email
            <input name="gazrus_contact" autocomplete="email" required>
        </label>
        <label>Контролируемый газ
            <input name="gazrus_gas" placeholder="CO, H2S, O2, CH4...">
        </label>
        <label>Тип прибора
            <select name="gazrus_device_type">
                <option value="">Не знаю, нужна консультация</option>
                <option>Стационарный газоанализатор</option>
                <option>Портативный газоанализатор</option>
                <option>Сигнализатор загазованности</option>
                <option>Газоаналитическая система</option>
            </select>
        </label>
        <label class="wide">Задача
            <textarea name="gazrus_message" rows="5" placeholder="Опишите объект, условия эксплуатации, нужную канальность, диапазон измерений и требования к документам."></textarea>
        </label>
        <label class="gazrus-hp">Сайт компании
            <input name="gazrus_company_site" tabindex="-1" autocomplete="off">
        </label>
        <button class="btn btn-warm" type="submit">Отправить заявку</button>
    </form>
    <?php
    return (string) ob_get_clean();
}

function gazrus_trim_meta(string $value): string
{
    $value = trim(preg_replace('/\s+/u', ' ', wp_strip_all_tags($value)));
    return mb_substr($value, 0, 300);
}

function gazrus_staging_noindex_headers(): void
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (str_starts_with($host, 'new.') || str_contains($host, ':8088')) {
        header('X-Robots-Tag: noindex, nofollow, noarchive', true);
    }
}

function gazrus_staging_robots_txt(string $output, bool $public): string
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (str_starts_with($host, 'new.') || str_contains($host, ':8088')) {
        return "User-agent: *\nDisallow: /\n";
    }
    return $output;
}

register_activation_hook(__FILE__, function (): void {
    gazrus_register_content_model();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function (): void {
    flush_rewrite_rules();
});
