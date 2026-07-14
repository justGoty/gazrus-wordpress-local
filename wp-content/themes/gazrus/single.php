<?php get_header(); ?>
<?php while (have_posts()) : the_post(); ?>
<main class="section">
    <div class="wrap">
        <article class="content">
            <h1 class="section-title"><?php the_title(); ?></h1>
            <?php the_content(); ?>
        </article>
    </div>
</main>
<?php endwhile; ?>
<?php get_footer(); ?>
