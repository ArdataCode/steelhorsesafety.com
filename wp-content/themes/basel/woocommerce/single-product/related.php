<?php
/**
 * Related Products
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( $related_products ) : ?>

	<section class="related products">
		<?php 

			$slider_args = array(
				'slides_per_view' => apply_filters( 'basel_related_products_per_view', 4 ),
				'title' => esc_html__( 'Related products', 'woocommerce' ),
				'img_size' => 'shop_catalog'
			);

			echo basel_generate_posts_slider( $slider_args, false, $related_products );
			
		?>

	</section>

<?php endif;

wp_reset_postdata();