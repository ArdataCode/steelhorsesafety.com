<?php
/**
 * The default template for displaying content
 *
 * Used for both single and index/archive/search.
 */

global $basel_loop;

// Partrs config array
$parts = array(
	'media' => true,
	'title' => true,
	'meta' => true,
	'text' => true,
	'btn' =>  true,
);

if ( ! empty( $basel_loop['parts'] ) )
	$parts = wp_parse_args( $basel_loop['parts'], $parts );

// Store loop count we're currently on
if ( empty( $basel_loop['loop'] ) )
	$basel_loop['loop'] = 0;

// Increase loop count
$basel_loop['loop']++;

if ( empty( $basel_loop['blog_design'] ) )
	$basel_loop['blog_design'] = basel_get_opt( 'blog_design' );

$blog_design = $basel_loop['blog_design'];

$classes = array('blog-design-' . $blog_design );
$classes[] = 'blog-post-loop';

if ( empty( $basel_loop['columns'] ) )
	$basel_loop['columns'] = basel_get_opt( 'blog_columns' );

$columns = $basel_loop['columns'];

if( in_array( $blog_design, array( 'masonry', 'mask' ) ) && ! is_single() )
	$classes[] = basel_get_grid_el_class($basel_loop['loop'], $columns, false, 12 );

if( is_single() ) 
	$classes[] = 'post-single-page';

if( get_the_title() == '' )
	$classes[] = 'post-no-title';

$gallery_slider = apply_filters( 'basel_gallery_slider', true );
$gallery = array();

if( get_post_format() == 'gallery' && $gallery_slider ) {
	$gallery = get_post_gallery(false, false);
	//ar(get_post_format() == 'gallery' && $gallery_slider && ! empty( $gallery['src'] ));
}

$random = 'carousel-' . rand(100,999);

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $classes ); ?>>
	<?php if ( $blog_design == 'default-alt' ): ?>
		<?php if ( get_the_category_list( ', ' ) ): ?>
			<div class="meta-post-categories"><?php echo get_the_category_list( ', ' ); ?></div>
		<?php endif ?>

		<?php if ( is_single() && $parts['title'] ) : ?>
			<h3 class="entry-title"><?php the_title(); ?></h3>
		<?php elseif( $parts['title'] ) : ?>
			<h3 class="entry-title">
				<a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark"><?php the_title(); ?></a>
			</h3>
		<?php endif; // is_single() ?>

		<?php if ( $parts['meta'] ): ?>
			<div class="entry-meta">
				<?php basel_post_meta(array(
					'date' => 0,
					'labels' => 1,
					'short_labels' => ( in_array( $blog_design, array( 'masonry', 'mask' ) ) ) 
				)); ?>
			</div><!-- .entry-meta -->
		<?php endif ?>
	<?php endif ?>
	<header class="entry-header">
		<?php if ( ( has_post_thumbnail() || ! empty( $gallery['src'] ) ) && ! post_password_required() && ! is_attachment() && $parts['media'] ) : ?>
			<figure id="<?php echo esc_attr( $random ); ?>" class="entry-thumbnail">
				<?php if($blog_design == 'default-alt' ) basel_post_date(); ?>

				<?php if( get_post_format() == 'gallery' && $gallery_slider && ! empty( $gallery['src'] ) ): ?>
					<ul class="post-gallery-slider owl-carousel">
						<?php 
							foreach ($gallery['src'] as $src) {
								?>
									<li> 
										<img src="<?php echo esc_attr( $src ); ?>">
									</li>
								<?php
							}
						?>
					</ul>
					<?php 
						basel_owl_carousel_init( array(
							'carousel_id' => $random,
							'slides_per_view' => 1,
							'hide_pagination_control' => 'yes'
						) );
					 ?>
				<?php elseif ( ! is_single() ): ?>

					<div class="post-img-wrapp">
						<a href="<?php echo esc_url( get_permalink() ); ?>">
							<?php echo basel_get_post_thumbnail( 'large' ); ?>
						</a>
					</div>
					<div class="post-image-mask">
						<a href="<?php echo esc_url( get_permalink() ); ?>"><?php _e("Read More", 'basel'); ?></a>
					</div>
					
				<?php else: ?>
					<?php the_post_thumbnail( 'full' ); ?>
				<?php endif ?>

			</figure>
		<?php endif; ?>

		<?php if ( $blog_design != 'default-alt' ): ?>

			<?php basel_post_date(); ?>

			<div class="post-mask">
				<?php if ( get_the_category_list( ', ' ) ): ?>
					<div class="meta-post-categories"><?php echo get_the_category_list( ', ' ); ?></div>
				<?php endif ?>

				<?php if ( is_single() && $parts['title'] ) : ?>
					<h3 class="entry-title"><?php the_title(); ?></h3>
				<?php elseif( $parts['title'] ) : ?>
					<h3 class="entry-title">
						<a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark"><?php the_title(); ?></a>
					</h3>
				<?php endif; // is_single() ?>

				<?php if ( $parts['meta'] ): ?>
					<div class="entry-meta">
						<?php basel_post_meta(array(
							'date' => 0,
							'labels' => 1,
							'short_labels' => ( in_array( $blog_design, array( 'masonry', 'mask' ) ) ) 
						)); ?>
					</div><!-- .entry-meta -->
				<?php endif ?>
			</div>
		<?php endif ?>

	</header><!-- .entry-header -->

	<?php if ( is_search() && $parts['text'] && get_post_format() != 'gallery' ) : // Only display Excerpts for Search ?>
		<div class="entry-summary">
			<?php the_excerpt(); ?>
		</div><!-- .entry-summary -->
	<?php elseif( $parts['text'] ) : ?>
		<div class="entry-content">
			<?php basel_get_content( $parts['btn'], is_single() ); ?>
			<?php wp_link_pages( array( 'before' => '<div class="page-links"><span class="page-links-title">' . esc_html__( 'Pages:', 'basel' ) . '</span>', 'after' => '</div>', 'link_before' => '<span>', 'link_after' => '</span>' ) ); ?>
		</div><!-- .entry-content -->
	<?php endif; ?>

	<div class="liner-continer">
		<span class="left-line"></span>
		<?php if( function_exists( 'basel_shortcode_social' ) ) echo basel_shortcode_social( array( 'style' => 'circle', 'size' => 'small' ) ); ?>
		<span class="right-line"></span>
	</div>

	<?php if ( is_single() && get_the_author_meta( 'description' ) ) : ?>
		<footer class="entry-meta">
			<?php get_template_part( 'author-bio' ); ?>
		</footer><!-- .entry-meta -->
	<?php endif; ?>
</article><!-- #post -->