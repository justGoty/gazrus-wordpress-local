<?php get_header(); ?>
<main class="section">
    <div class="wrap">
        <h1 class="section-title"><?php echo esc_html(get_the_archive_title() ?: get_bloginfo('name')); ?></h1>
        <div class="grid">
            <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <article class="card">
                    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                    <p><?php echo esc_html(wp_trim_words(get_the_excerpt() ?: get_the_content(), 28)); ?></p>
                </article>
            <?php endwhile; else : ?>
                <article class="card"><h2>Материалы не найдены</h2><p>Раздел готовится к заполнению.</p></article>
            <?php endif; ?>
        </div>
    </div>
</main>
<?php get_footer(); ?>
