<?php

// Meta Fields
function porto_block_meta_fields() {
	$fields = array();
	global $post;

	$builder_type = get_post_meta( $post->ID, 'porto_builder_type', true );

	if ( $post && $post->ID && 'porto_builder' == $post->post_type && 'block' != $builder_type && 'type' != $builder_type ) {
		$fields['condition'] = array(
			'name'  => 'condition',
			'title' => __( 'Display Condition', 'porto-functionality' ),
			'desc'  => __( '<span style="color: red;">Set the conditions that determine where your Template is used throughout your site.</span>', 'porto-functionality' ),
			'type'  => 'button',
			'value' => __( 'Set Condition', 'porto-functionality' ),
		);
		if ( 'header' == $builder_type ) {
			$fields['header_type'] = array(
				'name'    => 'header_type',
				'title'   => __( 'Header Type', 'porto-functionality' ),
				'desc'    => sprintf( __( 'After changed, you should save theme options in the redux panel. You can change %1$sSide Header Position%2$s value in theme option.', 'porto-functionality' ), '<a href="' . porto_get_theme_option_url( 'header-side-position' ) . '" target="_blank">', '</a>' ),
				'type'    => 'select',
				'default' => '',
				'options' => array(
					''     => __( 'Default', 'porto-functionality' ),
					'side' => __( 'Side Header', 'porto-functionality' ),
				),
			);
			$fields['header_side_width'] = array(
				'name'    => 'header_side_width',
				'title'   => __( 'Side Header Width (e.g: 300)px', 'porto-functionality' ),
				'desc'    => __( 'Please input the only number of Side Header Width. After changed, you should save theme options in the redux panel.', 'porto-functionality' ),
				'type'    => 'text',
				'required' => array(
					'name'  => 'header_type',
					'value' => 'side',
				),
			);
		} elseif ( 'product' == $builder_type ) {
			$fields['disable_sticky_sidebar'] = array(
				'name'  => 'disable_sticky_sidebar',
				'title' => __( 'Disable Sticky Sidebar', 'porto-functionality' ),
				'type'  => 'checkbox',
				'desc'  => sprintf( __( 'You can change %1$sglobal%2$s value in theme option.', 'porto-functionality' ), '<a href="' . porto_get_theme_option_url( 'sticky-sidebar' ) . '" target="_blank">', '</a>' ),
			);
		} elseif ( 'popup' == $builder_type && ( ! defined( 'VCV_VERSION' ) && ! defined( 'ELEMENTOR_VERSION' ) ) ) {
			$fields['popup_width']     = array(
				'name'    => 'popup_width',
				'title'   => __( 'Popup Width (px)', 'porto-functionality' ),
				'type'    => 'text',
				'default' => '740',
			);
			$fields['popup_animation'] = array(
				'name'    => 'popup_animation',
				'title'   => __( 'Popup Animation', 'porto-functionality' ),
				'type'    => 'select',
				'default' => 'mfp-fade',
				'options' => array(
					'mfp-fade'       => __( 'Fade', 'porto-functionality' ),
					'my-mfp-zoom-in' => __( 'Zoom in', 'porto-functionality' ),
				),
			);
			$fields['load_duration']   = array(
				'name'    => 'load_duration',
				'title'   => __( 'Popup Load Time (ms)', 'porto-functionality' ),
				'type'    => 'text',
				'default' => '4000',
			);
		}
	}

	$fields = array_merge(
		$fields,
		array(
			// Layout
			'container'  => array(
				'name'    => 'container',
				'title'   => __( 'Wrap as Container', 'porto-functionality' ),
				'type'    => 'select',
				'default' => '',
				'options' => array(
					'yes'   => __( 'Inner Container', 'porto-functionality' ),
					'fluid' => __( 'Fluid Container', 'porto-functionality' ),
				),
			),
			'custom_css' => array(
				'name'  => 'custom_css',
				'title' => __( 'Custom CSS', 'porto-functionality' ),
				'type'  => 'textarea',
				'desc'  => sprintf( __( 'You can change %1$sglobal%2$s value in theme option.', 'porto-functionality' ), '<a href="' . porto_get_theme_option_url( 'css-code' ) . '" target="_blank">', '</a>' ),
			),
		)
	);

	if ( current_user_can( 'manage_options' ) ) {
		$fields['custom_js_body'] = array(
			'name'  => 'custom_js_body',
			'title' => __( 'JS Code', 'porto-functionality' ),
			'type'  => 'textarea',
			'desc'  => sprintf( __( 'You can change %1$sglobal%2$s value in theme option.', 'porto-functionality' ), '<a href="' . porto_get_theme_option_url( 'js-code' ) . '" target="_blank">', '</a>' ),
		);
	}

	return $fields;
}

function porto_block_meta_box() {
	$meta_fields = porto_block_meta_fields();
	porto_show_meta_box( $meta_fields );
}

// Save Meta Values
add_action( 'save_post', 'porto_save_block_meta_values' );
function porto_save_block_meta_values( $post_id ) {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return;
	}
	$screen = get_current_screen();
	if ( $screen && 'post' == $screen->base && ( 'block' == $screen->id || 'porto_builder' == $screen->id ) ) {
		porto_save_meta_value( $post_id, porto_block_meta_fields() );
	}
}

// Remove in default custom field meta box
add_filter( 'is_protected_meta', 'porto_block_protected_meta', 10, 3 );
function porto_block_protected_meta( $protected, $meta_key, $meta_type ) {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return $protected;
	}
	$screen = get_current_screen();
	if ( ! $protected && $screen && 'post' == $screen->base && ( 'block' == $screen->id || 'porto_builder' == $screen->id ) ) {
		if ( array_key_exists( $meta_key, porto_block_meta_fields() ) ) {
			$protected = true;
		}
	}
	return $protected;
}
