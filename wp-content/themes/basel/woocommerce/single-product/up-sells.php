<?php
/**
 * Single Product Up-Sells
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( $upsells ) : ?>

	<section class="up-sells upsells products">
		<?php 

			$slider_args = array(
				'slides_per_view' => apply_filters( 'basel_upsells_per_view', 4 ),
				'title' => esc_html__( 'You may also like&hellip;', 'woocommerce' ),
				'img_size' => 'shop_catalog'
			);

			echo basel_generate_posts_slider( $slider_args, false, $upsells );
			
		?>

	</section>

<?php endif;

wp_reset_postdata();