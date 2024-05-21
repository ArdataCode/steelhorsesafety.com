<?php if ( ! defined('BASEL_THEME_DIR')) exit('No direct script access allowed');

/**
 * ------------------------------------------------------------------------------------------------
 * Enqueue admin scripts
 * ------------------------------------------------------------------------------------------------
 */
if( ! function_exists( 'basel_admin_scripts' ) ) {
	function basel_admin_scripts() {
		wp_enqueue_script( 'basel-admin-scripts', BASEL_ASSETS . '/js/admin.js', array(), '', true );

		if( apply_filters( 'basel_gradients_enabled', true ) ) {
			wp_enqueue_script( 'basel-colorpicker-scripts', BASEL_ASSETS . '/js/colorpicker.min.js', array(), '', true );
			wp_enqueue_script( 'basel-gradient-scripts', BASEL_ASSETS . '/js/gradX.min.js', array(), '', true );
		}

		basel_admin_scripts_localize();

	}
	add_action('admin_init','basel_admin_scripts', 100);
}

/**
 * ------------------------------------------------------------------------------------------------
 * Localize admin script function
 * ------------------------------------------------------------------------------------------------
 */
if( ! function_exists( 'basel_admin_scripts_localize' ) ) {
	function basel_admin_scripts_localize() {
		wp_localize_script( 'basel-admin-scripts', 'baselConfig', basel_admin_script_local() );
	}
}


/**
 * ------------------------------------------------------------------------------------------------
 * Get localization array for admin scripts
 * ------------------------------------------------------------------------------------------------
 */
if( ! function_exists( 'basel_admin_script_local' ) ) {
	function basel_admin_script_local() {
		$localize_data = array(
			'ajax' => admin_url( 'admin-ajax.php' ),
		);

		// If we are on edit product attribute page
		if( ! empty( $_GET['page'] ) && $_GET['page'] == 'product_attributes' && ! empty( $_GET['edit'] ) && function_exists('wc_attribute_taxonomy_name_by_id')) {
			$attribute_id = absint( $_GET['edit'] );
			$attribute_name = wc_attribute_taxonomy_name_by_id( $attribute_id );
			$localize_data['attributeSwatchSize'] = basel_wc_get_attribute_term( $attribute_name, 'swatch_size' );
		}

		return apply_filters( 'basel_admin_script_local', $localize_data );
	}
}


/**
 * ------------------------------------------------------------------------------------------------
 * Enqueue admin styles
 * ------------------------------------------------------------------------------------------------
 */
if( ! function_exists( 'basel_enqueue_admin_styles' ) ) {
	function basel_enqueue_admin_styles() {
		if ( is_admin() ) {
			wp_enqueue_style( 'basel-admin-style', BASEL_ASSETS . '/css/theme-admin.css');
			if( apply_filters( 'basel_gradients_enabled', true ) ) {
				wp_enqueue_style( 'basel-colorpicker-style', BASEL_ASSETS . '/css/colorpicker.css', array() );
				wp_enqueue_style( 'basel-gradient-style', BASEL_ASSETS . '/css/gradX.css', array() );
			}
		}

	}

	add_action( 'admin_enqueue_scripts', 'basel_enqueue_admin_styles' );
}

