<?php
$output = $title = $cat = $cats = $post_in = $number = $view_more = $view_more_class = $filter = $pagination = $animation_type = $animation_duration = $animation_delay = $el_class = '';

$default_atts = array(
	'title'              => '',
	'cats'               => '',
	'cat'                => '',
	'post_in'            => '',
	'number'             => 8,
	'view_more'          => false,
	'view_more_class'    => '',
	'filter'             => false,
	'filter_type'        => '',
	'pagination'         => false,
	'animation_type'     => '',
	'animation_duration' => 1000,
	'animation_delay'    => 0,
	'el_class'           => '',
	'posts_wrap_cls'     => '',
);
extract(
	shortcode_atts(
		$default_atts,
		$atts
	)
);

$args = array(
	'post_type'      => 'faq',
	'posts_per_page' => $number,
);

if ( ! $cats ) {
	$cats = $cat;
}

if ( $cats ) {
	$cat               = explode( ',', $cats );
	$args['tax_query'] = array(
		array(
			'taxonomy' => 'faq_cat',
			'field'    => is_numeric( $cat[0] ) ? 'term_id' : 'slug',
			'terms'    => $cat,
		),
	);
}

if ( $post_in ) {
	$args['post__in'] = explode( ',', $post_in );
	$args['orderby']  = 'post__in';
}

if ( $pagination && $paged = get_query_var( 'paged' ) ) {
	$args['paged'] = $paged;
}

$posts = new WP_Query( $args );

$faq_taxs = array();

if ( $filter ) {
	global $porto_settings;

	$tax_args = array(
		'taxonomy'   => 'faq_cat',
		'hide_empty' => true,
		'orderby'    => isset( $porto_settings['faq-cat-orderby'] ) ? $porto_settings['faq-cat-orderby'] : 'name',
		'order'      => isset( $porto_settings['faq-cat-order'] ) ? $porto_settings['faq-cat-order'] : 'asc',
	);
	if ( ! empty( $cats ) && is_numeric( $cat[0] ) ) {
		$tax_args['include'] = sanitize_text_field( $cats );
	}
	$taxs = get_terms( $tax_args );

	foreach ( $taxs as $tax ) {
		$faq_taxs[ urldecode( $tax->slug ) ] = $tax->name;
	}

	if ( empty( $filter_type ) && 'infinite' != $pagination && 'load_more' != $pagination && is_array( $posts->posts ) && ! empty( $posts->posts ) ) {
		$posts_faq_taxs = array();
		foreach ( $posts->posts as $post ) {
			$post_taxs = wp_get_post_terms( $post->ID, 'faq_cat', array( 'fields' => 'id=>slug' ) );
			if ( is_array( $post_taxs ) && ! empty( $post_taxs ) ) {
				foreach ( $post_taxs as $post_tax_id => $post_tax_slug ) {
					if ( is_array( $cat ) && ! empty( $cat ) && in_array( $post_tax_id, $cat ) ) {
						$posts_faq_taxs[ urldecode( $post_tax_slug ) ] = 1;
					}

					if ( empty( $cat ) || ! isset( $cat ) ) {
						$posts_faq_taxs[ urldecode( $post_tax_slug ) ] = 1;
					}
				}
			}
		}

		foreach ( $faq_taxs as $key => $value ) {
			if ( ! isset( $posts_faq_taxs[ $key ] ) ) {
				unset( $faq_taxs[ $key ] );
			}
		}
	}
}

$shortcode_id = porto_generate_rand( 4 );

if ( $posts->have_posts() ) {
	$el_class = porto_shortcode_extract_class( $el_class );

	$output = '<div class="porto-faqs porto-faqs' . $shortcode_id . ' wpb_content_element ' . esc_attr( $el_class ) . '"';
	if ( $animation_type ) {
		$output .= ' data-appear-animation="' . esc_attr( $animation_type ) . '"';
		if ( $animation_delay ) {
			$output .= ' data-appear-animation-delay="' . esc_attr( $animation_delay ) . '"';
		}
		if ( $animation_duration && 1000 != $animation_duration ) {
			$output .= ' data-appear-animation-duration="' . esc_attr( $animation_duration ) . '"';
		}
	}
	$output .= '>';

	$output .= porto_shortcode_widget_title(
		array(
			'title'      => $title,
			'extraclass' => '',
		)
	);

	$wrap_cls   = 'page-faqs clearfix';
	$wrap_attrs = ' id="porto_faqs_' . porto_generate_rand( 4 ) . '"';

	if ( ! empty( $title ) ) {
		$wrap_cls .= ' m-t-lg';
	}

	if ( ! empty( $shortcode_class ) ) {
		$wrap_cls .= $shortcode_class;
	}

	if ( $pagination ) {
		$wrap_cls   .= ' porto-ajax-load';
		$wrap_attrs .= ' data-post_type="faq"';
		if ( 'infinite' == $pagination ) {
			$wrap_cls .= ' load-infinite';
			wp_enqueue_script( 'porto-jquery-infinite-scroll' );
		} elseif ( 'load_more' == $pagination ) {
			$wrap_cls .= ' load-more';
			wp_enqueue_script( 'porto-jquery-infinite-scroll' );
		} else {
			$wrap_cls .= ' load-ajax';
		}
	}
	if ( 'ajax' == $filter_type || $pagination ) {
		// extra options
		$options = array();
		foreach ( $default_atts as $key => $val ) {
			if ( ! empty( $atts[ $key ] ) ) {
				$options[ $key ] = $atts[ $key ];
			}
		}
		$wrap_attrs .= ' data-ajax_load_options="' . esc_attr( json_encode( $options ) ) . '"';

		wp_enqueue_script( 'porto-infinite-scroll' );
	}

	ob_start(); ?>

	<div class="<?php echo esc_attr( $wrap_cls ); ?>"<?php echo porto_filter_output( $wrap_attrs ); ?>>

		<?php
		if ( is_array( $faq_taxs ) && ! empty( $faq_taxs ) ) :
			?>
			<ul class="faq-filter nav nav-pills sort-source<?php echo 'ajax' == $filter_type ? ' porto-ajax-filter' : ''; ?>">
				<li class="active" data-filter="*"><a><?php esc_html_e( 'Show All', 'porto-functionality' ); ?></a></li>
				<?php foreach ( $faq_taxs as $faq_tax_slug => $faq_tax_name ) : ?>
					<li data-filter="<?php echo esc_attr( $faq_tax_slug ); ?>"><a><?php echo esc_html( $faq_tax_name ); ?></a></li>
				<?php endforeach; ?>
			</ul>
			<hr>
		<?php endif; ?>

		<?php
			// infinite scrolling
			$container_attrs = '';
			if ( ( 'infinite' == $pagination || 'load_more' == $pagination ) && $posts->max_num_pages ) {
				$container_attrs .= ' data-cur_page="' . ( $paged ? (int) $paged : 1 ) . '" data-max_page="' . intval( $posts->max_num_pages ) . '"';
			}
		?>

		<div class="faq-row faqs-container<?php echo ! $posts_wrap_cls ? '' : ' ' . esc_attr( $posts_wrap_cls ); ?>"<?php echo porto_filter_output( $container_attrs ); ?>>
			<?php
			while ( $posts->have_posts() ) {
				$posts->the_post();

				get_template_part( 'content', 'archive-faq' );
			}
			?>
		</div>

		<?php if ( $pagination && function_exists( 'porto_pagination' ) ) : ?>
			<input type="hidden" class="shortcode-id" value="<?php echo esc_attr( $shortcode_id ); ?>"/>
			<?php porto_pagination( $posts->max_num_pages, 'load_more' == $pagination, $posts ); ?>
		<?php endif; ?>

	</div>

	<?php if ( $view_more ) : ?>
		<div class="push-top m-b-xxl text-center">
			<a class="btn btn-primary<?php echo ! empty( $view_more_class ) ? ' ' . str_replace( '.', '', $view_more_class ) : ''; ?>" href="<?php echo get_post_type_archive_link( 'faq' ); ?>"><?php esc_html_e( 'View More', 'porto-functionality' ); ?></a>
		</div>
	<?php endif; ?>

	<?php
	$output .= ob_get_clean();

	$output .= '</div>';

	echo porto_filter_output( $output );
}

wp_reset_postdata();
