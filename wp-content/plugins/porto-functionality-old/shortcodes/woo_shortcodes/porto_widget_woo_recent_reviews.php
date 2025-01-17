<?php

// Porto Widget Woo Recent Reviews
add_action( 'vc_after_init', 'porto_load_widget_woo_recent_reviews_shortcode' );

function porto_load_widget_woo_recent_reviews_shortcode() {
	$animation_type     = porto_vc_animation_type();
	$animation_duration = porto_vc_animation_duration();
	$animation_delay    = porto_vc_animation_delay();
	$custom_class       = porto_vc_custom_class();

	// woocommerce recent reviews
	vc_map(
		array(
			'name'        => 'Porto ' . __( 'Recent Reviews', 'porto-functionality' ) . ' ' . __( 'Widget', 'porto-functionality' ),
			'base'        => 'porto_widget_woo_recent_reviews',
			'icon'        => PORTO_WIDGET_URL . 'woo.png',
			'class'       => 'porto-wpb-widget wpb_vc_wp_widget',
			'category'    => __( 'WooCommerce Widgets', 'porto-functionality' ),
			'description' => __( 'Display a list of your most recent reviews on your site.', 'porto-functionality' ),
			'params'      => array_merge(
				array(
					array(
						'type'        => 'textfield',
						'heading'     => __( 'Title', 'woocommerce' ),
						'param_name'  => 'title',
						'admin_label' => true,
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Layout', 'porto-functionality' ),
						'param_name' => 'view',
						'std'        => 'grid',
						'value'      => array(
							__( 'Grid', 'porto-functionality' )   => 'grid',
							__( 'Slider', 'porto-functionality' ) => 'products-slider',
						),
					),
					array(
						'type'       => 'dropdown',
						'heading'    => __( 'Columns', 'porto-functionality' ),
						'param_name' => 'columns',
						'std'        => '2',
						'value'      => porto_sh_commons( 'blog_grid_columns' ),
					),
					array(
						'type'       => 'textfield',
						'heading'    => __( 'Number of products to show', 'woocommerce' ),
						'param_name' => 'number',
						'value'      => 6,
					),
					array(
						'type'       => 'checkbox',
						'heading'    => __( 'Show Description', 'porto-functionality' ),
						'param_name' => 'show_desc',
						'value'      => array( __( 'Yes', 'js_composer' ) => 'yes' ),
					),
					$custom_class,
				),
				porto_vc_product_slider_fields( 'products-slider', 'dots-style-1' ),
				array(
					$animation_type,
					$animation_duration,
					$animation_delay,
				)
			),
		)
	);

	if ( ! class_exists( 'WPBakeryShortCode_Porto_Widget_Woo_Recent_Reviews' ) ) {
		class WPBakeryShortCode_Porto_Widget_Woo_Recent_Reviews extends WPBakeryShortCode {
		}
	}
}
