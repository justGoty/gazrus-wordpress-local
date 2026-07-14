<article class="card product-card">
    <a href="<?php the_permalink(); ?>">
        <?php $image = gazrus_asset_image(get_the_ID(), 'medium'); ?>
        <?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="<?php the_title_attribute(); ?>"><?php endif; ?>
        <span class="eyebrow">Демо-карточка</span>
        <h3><?php the_title(); ?></h3>
    </a>
    <p><?php echo esc_html(wp_trim_words(get_the_excerpt() ?: get_the_content(), 22)); ?></p>
    <div class="product-tags">
        <?php
        foreach (['gaz_product_type', 'gaz_channel', 'gaz_gas'] as $taxonomy) {
            $terms = get_the_terms(get_the_ID(), $taxonomy);
            if ($terms && !is_wp_error($terms)) {
                foreach (array_slice($terms, 0, 3) as $term) {
                    echo '<span>' . esc_html($term->name) . '</span>';
                }
            }
        }
        ?>
    </div>
    <?php $range = get_post_meta(get_the_ID(), '_gazrus_range', true); ?>
    <?php if ($range) : ?><p class="product-specline">Диапазон: <?php echo esc_html($range); ?></p><?php endif; ?>
    <div class="price"><?php echo esc_html(gazrus_price(get_the_ID())); ?></div>
</article>
