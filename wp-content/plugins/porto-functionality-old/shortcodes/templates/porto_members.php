<?php
$output = $title = $columns = $view = $hover_image_effect = $overview = $socials = $cat = $cats = $post_in = $number = $role = $view_more = $view_more_class = $filter = $pagination = $ajax_load = $ajax_modal = $animation_type = $animation_duration = $animation_delay = $el_class = '';

$default_atts = array(
	'title'              => '',
	'style'              => '',
	'columns'            => 4,
	'view'               => 'classic',
	'hover_image_effect' => 'zoom',
	'overview'           => true,
	'socials'            => true,
	'cats'               => '',
	'cat'                => '',
	'post_in'            => '',
	'number'             => 8,
	'role'               => false,
	'view_more'          => false,
	'view_more_class'    => '',
	'filter'             => false,
	'filter_style'       => '',
	'filter_type'        => '',
	'pagination'         => false,
	'ajax_load'          => false,
	'ajax_modal'         => false,
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

wp_enqueue_script( 'isotope' );

$args = array(
	'post_type'      => 'member',
	'posts_per_page' => $number,
);

if ( ! $cats ) {
	$cats = $cat;
}

if ( $cats ) {
	$cat               = explode( ',', $cats );
	$args['tax_query'] = array(
		array(
			'taxonomy' => 'member_cat',
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

$member_taxs = array();

if ( $filter ) {
	global $porto_settings;

	$tax_args = array(
		'taxonomy'   => 'member_cat',
		'hide_empty' => true,
		'orderby'    => isset( $porto_settings['member-cat-orderby'] ) ? $porto_settings['member-cat-orderby'] : 'name',
		'order'      => isset( $porto_settings['member-cat-order'] ) ? $porto_settings['member-cat-order'] : 'asc',
	);
	if ( ! empty( $cats ) && is_numeric( $cat[0] ) ) {
		$tax_args['include'] = sanitize_text_field( $cats );
	}
	$taxs = get_terms( $tax_args );

	foreach ( $taxs as $tax ) {
		$member_taxs[ urldecode( $tax->slug ) ] = $tax->name;
	}

	if ( empty( $filter_type ) && 'infinite' != $pagination && 'load_more' != $pagination && is_array( $posts->posts ) && ! empty( $posts->posts ) ) {
		$posts_member_taxs = array();
		foreach ( $posts->posts as $post ) {
			$post_taxs = wp_get_post_terms( $post->ID, 'member_cat', array( 'fields' => 'id=>slug' ) );
			if ( is_array( $post_taxs ) && ! empty( $post_taxs ) ) {
				foreach ( $post_taxs as $post_tax_id => $post_tax_slug ) {
					if ( is_array( $cat ) && ! empty( $cat ) && in_array( $post_tax_id, $cat ) ) {
						$posts_member_taxs[ urldecode( $post_tax_slug ) ] = 1;
					}

					if ( empty( $cat ) || ! isset( $cat ) ) {
						$posts_member_taxs[ urldecode( $post_tax_slug ) ] = 1;
					}
				}
			}
		}

		foreach ( $member_taxs as $key => $value ) {
			if ( ! isset( $posts_member_taxs[ $key ] ) ) {
				unset( $member_taxs[ $key ] );
			}
		}
	}
}

$shortcode_id = porto_generate_rand( 4 );

if ( ! empty( $shortcode_class ) ) {
	$el_class .= ' ' . trim( $shortcode_class );
}

if ( $posts->have_posts() ) {
	$el_class = porto_shortcode_extract_class( $el_class );

	$output = '<div class="porto-members porto-members' . $shortcode_id . ' wpb_content_element ' . esc_attr( trim( $el_class ) ) . '"';
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

	global $porto_member_columns, $porto_member_view, $porto_member_role, $porto_member_overview, $porto_member_socials, $porto_member_ajax_load, $porto_member_ajax_modal, $porto_custom_zoom;

	$porto_member_columns    = $columns;
	$porto_member_view       = $view;
	$porto_member_role       = $role ? 'yes' : 'no';
	$porto_custom_zoom       = $hover_image_effect;
	$porto_member_overview   = $overview ? 'yes' : 'no';
	$porto_member_socials    = $socials ? 'yes' : 'no';
	$porto_member_ajax_load  = $ajax_load ? 'yes' : 'no';
	$porto_member_ajax_modal = $ajax_modal ? 'yes' : 'no';

	$wrap_cls   = 'page-members clearfix';
	$wrap_attrs = ' id="porto_members_' . porto_generate_rand( 4 ) . '"';

	if ( ! empty( $title ) ) {
		$wrap_cls .= ' m-t-lg';
	}

	if ( $pagination ) {
		$wrap_cls   .= ' porto-ajax-load';
		$wrap_attrs .= ' data-post_type="member" data-post_layout="' . esc_attr( $style ? $style : $view ) . '"';
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
			if ( ! empty( $atts[ $key ] ) || ( isset( $atts[ $key ] ) && in_array( $key, array( 'socials', 'overview' ) ) ) ) {
				$options[ $key ] = $atts[ $key ];
			}
		}
		$wrap_attrs .= ' data-ajax_load_options="' . esc_attr( json_encode( $options ) ) . '"';

		wp_enqueue_script( 'porto-infinite-scroll' );
	}

	ob_start(); ?>

	<div class="<?php echo esc_attr( $wrap_cls ); ?>"<?php echo porto_filter_output( $wrap_attrs ); ?>>

		<?php if ( $ajax_load && ! $ajax_modal ) : ?>
			<div id="memberAjaxBox" class="ajax-box">
				<div class="bounce-loader">
					<div class="bounce1"></div>
					<div class="bounce2"></div>
					<div class="bounce3"></div>
				</div>
				<div class="ajax-box-content" id="memberAjaxBoxContent"></div>
				<?php if ( function_exists( 'porto_title_archive_name' ) && porto_title_archive_name( 'member' ) ) : ?>
					<?php /* translators: %s: Member archive name */ ?>
					<div class="hide ajax-content-append"><h4 class="m-t-sm m-b-lg"><?php echo sprintf( __( 'More %s:', 'porto-functionality' ), porto_title_archive_name( 'member' ) ); ?></h4></div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php
		if ( is_array( $member_taxs ) && ! empty( $member_taxs ) ) :
			?>
			<ul class="member-filter nav sort-source <?php echo ! empty( $filter_style ) ? 'sort-source-' . esc_attr( $filter_style ) : 'nav-pills', 'ajax' == $filter_type ? ' porto-ajax-filter' : ''; ?>">
				<li class="active" data-filter="*"><a href="#"><?php esc_html_e( 'Show All', 'porto-functionality' ); ?></a></li>
				<?php foreach ( $member_taxs as $member_tax_slug => $member_tax_name ) : ?>
					<li data-filter="<?php echo esc_attr( $member_tax_slug ); ?>"><a href="#"><?php echo esc_html( $member_tax_name ); ?></a></li>
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

		<?php if ( $style ) : ?>
			<div class="members-container member-row member-row-advanced<?php echo ! $posts_wrap_cls ? '' : ' ' . esc_attr( $posts_wrap_cls ); ?>"<?php echo porto_filter_output( $container_attrs ); ?>>
			<?php
				$counter = 0;
			while ( $posts->have_posts() ) {
				$posts->the_post();
				porto_get_template_part(
					'content',
					'member',
					array(
						'member_counter' => $counter,
					)
				);
				$counter++;
			}
			?>
			</div>
		<?php else : ?>
			<div class="members-container member-row row<?php echo function_exists( 'porto_generate_column_classes' ) ? ' ccols-wrap ' . porto_generate_column_classes( $columns ) : '', ! $posts_wrap_cls ? '' : ' ' . esc_attr( $posts_wrap_cls ); ?>"<?php echo porto_filter_output( $container_attrs ); ?>>
			<?php
			while ( $posts->have_posts() ) {
				$posts->the_post();
				get_template_part( 'content', 'archive-member' );
			}
			?>
			</div>
		<?php endif; ?>

		<?php if ( $pagination && function_exists( 'porto_pagination' ) ) : ?>
			<input type="hidden" class="shortcode-id" value="<?php echo esc_attr( $shortcode_id ); ?>"/>
			<?php porto_pagination( $posts->max_num_pages, 'load_more' == $pagination, $posts ); ?>
		<?php endif; ?>

	</div>

	<?php if ( $view_more ) : ?>
		<div class="push-top m-b-xxl text-center">
			<a class="btn btn-primary<?php echo esc_attr( $view_more_class ? ' ' . str_replace( '.', '', $view_more_class ) : '' ); ?>" href="<?php echo get_post_type_archive_link( 'member' ); ?>"><?php esc_html_e( 'View More', 'porto-functionality' ); ?></a>
		</div>
	<?php endif; ?>

	<?php
	$output .= ob_get_clean();

	$porto_member_columns = $porto_member_view = $porto_member_role = $porto_member_overview = $porto_member_socials = $porto_member_ajax_load = $porto_member_ajax_modal = '';

	$output .= '</div>';

	echo porto_filter_output( $output );
}

wp_reset_postdata();
