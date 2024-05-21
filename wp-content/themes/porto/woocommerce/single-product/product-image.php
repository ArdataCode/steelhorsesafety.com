<?php
/**
 * Single Product Image
 *
 * @version     7.8.0
 */

defined( 'ABSPATH' ) || exit;

global $post, $woocommerce, $product, $porto_settings, $porto_settings_optimize, $porto_product_layout, $porto_product_info, $porto_scatted_layout;
$attachment_ids = $product->get_gallery_image_ids();

$items_count            = 1;
$product_images_classes = '';
$product_image_classes  = 'img-thumbnail';
$product_images_attrs   = '';

if ( 'extended' === $porto_product_layout ) {
	$items_count               = get_post_meta( get_the_ID(), 'product_layout_columns', true );
	$items_count               = ( ! $items_count && isset( $porto_settings['product-single-columns'] ) ) ? $porto_settings['product-single-columns'] : 3;
	if ( ! empty( $porto_product_info['items'] ) ) {
		$product_images_attrs .= ' data-items="' . $porto_product_info['items'] . '"';
	} else {
		$product_images_attrs .= ' data-items="3"';
	}
	if ( ! isset( $porto_product_info['center_mode'] ) || ! empty( $porto_product_info['center_mode'] ) ) {
		$product_images_attrs .= ' data-centeritem';
	}
	if ( ! empty( $porto_product_info['responsive'] ) ) {
		$product_images_attrs .= ' data-responsive="' . esc_attr( json_encode( $porto_product_info['responsive'] ) ) . '"';
	} else {
		$columns_responsive        = array();
		$columns_responsive['768'] = 3;
		$columns_responsive['0']   = 1;
		$product_images_attrs     .= ' data-responsive="' . esc_attr( json_encode( $columns_responsive ) ) . '"';
	}
	if ( isset( $porto_product_info['loop'] ) ) {
		$product_images_attrs .= ' data-loop="' . esc_attr( $porto_product_info['loop'] ) . '"';
	}
	if ( ! empty( $porto_product_info['margin'] ) ) {
		$product_images_attrs .= ' data-margin="' . esc_attr( $porto_product_info['margin'] ) . '"';
	}
}
if ( 'grid' === $porto_product_layout ) {
	$product_images_classes = 'product-images-block row';
	$items_count            = get_post_meta( get_the_ID(), 'product_layout_grid_columns', true );
	$items_count            = ( ! $items_count && isset( $porto_settings['product-single-columns'] ) ) ? $porto_settings['product-single-columns'] : 2;
	$items_count            = '2';
	if ( '1' === $items_count ) {
		$product_image_classes .= ' col-lg-12';
	} elseif ( '2' === $items_count ) {
		$product_image_classes .= ' col-sm-6';
	} elseif ( '3' === $items_count ) {
		$product_image_classes .= ' col-sm-6 col-lg-4';
	} elseif ( '4' === $items_count ) {
		$product_image_classes .= ' col-sm-6 col-lg-3';
	}
} elseif ( 'sticky_info' === $porto_product_layout || 'sticky_both_info' === $porto_product_layout ) {
	$product_images_classes = 'product-images-block';
} else {
	$product_images_classes = 'product-image-slider owl-carousel show-nav-hover';
	if ( 'extended' === $porto_product_layout ) {
		if ( ! empty( $porto_product_info['columns_class'] ) ) {
			$product_images_classes .= ' ' . $porto_product_info['columns_class'];
		} else {
			$product_images_classes .= ' has-ccols ccols-1 ccols-md-3';
		}
		if ( ! empty( $porto_product_info['enable_flick'] ) ) {
			$product_images_classes .= ' flick-carousel';
		}
	} else {
		$product_images_classes .= ' has-ccols ccols-1';
	}
}
// for 360 degree view
$attach_gallery_ids = get_post_meta( $post->ID, 'porto_product_360_gallery', true );
$image_view_cls = 'image-galley-viewer';
if ( ! $porto_settings['product-image-popup'] || 'sticky_both_info' === $porto_product_layout ) {
	$image_view_cls .= ' without-zoom';
}
?>
<div class="product-images images">
	<?php
	$html            = '<div class="' . esc_attr( $product_images_classes ) . '"' . $product_images_attrs . '>';
	$attachment_id   = method_exists( $product, 'get_image_id' ) ? $product->get_image_id() : get_post_thumbnail_id();
	$product_icon_cl = 'porto-icon-plus';
	if ( ! empty( $porto_product_info['icon_cl'] ) ) {
		$product_icon_cl = $porto_product_info['icon_cl'];
	}

	if ( $attachment_id ) {

		$image_link = wp_get_attachment_image_url( $attachment_id, 'full' );

		$html .= '<div class="' . esc_attr( $product_image_classes ) . '"><div class="inner">';
		$html .= wp_get_attachment_image(
			$attachment_id,
			( ! empty(  $porto_scatted_layout ) || 'full_width' === $porto_product_layout ) ? 'full' : 'woocommerce_single',
			false,
			array(
				'href'  => esc_url( $image_link ),
				'class' => 'woocommerce-main-image img-responsive',
				'title' => _wp_specialchars( get_post_field( 'post_title', $attachment_id ), ENT_QUOTES, 'UTF-8', true ),
			)
		);
		if ( ( 'grid' === $porto_product_layout || 'sticky_info' === $porto_product_layout || 'sticky_both_info' === $porto_product_layout ) && $attach_gallery_ids ) {
			$html .= '<a class="' . $image_view_cls . '" href="#"><i class="porto-icon-rotate"></i></a>';
		}
		if ( $porto_settings['product-image-popup'] && ( 'grid' === $porto_product_layout || 'sticky_info' === $porto_product_layout ) ) {
			$html .= '<a class="zoom" href="' . esc_url( $image_link ) . '"><i class="' . esc_attr( $product_icon_cl ) . '"></i></a>';
		}
		$html .= '</div></div>';

	} else {

		$image_link = wc_placeholder_img_src( 'woocommerce_single' );
		$html      .= '<div class="' . esc_attr( $product_image_classes ) . '"><div class="inner">';
		$html      .= '<img src="' . esc_url( $image_link ) . '" alt="placeholder" href="' . esc_url( $image_link ) . '" class="woocommerce-main-image img-responsive" />';
		$html      .= '</div></div>';
	}

	if ( $attachment_ids ) {
		foreach ( $attachment_ids as $attachment_id ) {

			$image_link = wp_get_attachment_image_url( $attachment_id, 'full' );

			if ( ! $image_link ) {
				continue;
			}

			$html .= '<div class="' . esc_attr( $product_image_classes ) . '"><div class="inner">';
			$size  = ( ! empty(  $porto_scatted_layout ) || 'full_width' === $porto_product_layout ) ? 'full' : 'woocommerce_single';
			if ( strpos( $product_images_classes, 'product-image-slider owl-carousel' ) !== false && isset( $porto_settings_optimize['lazyload'] ) && $porto_settings_optimize['lazyload'] ) {
				$thumb_image = wp_get_attachment_image_src( $attachment_id, $size );
				if ( $thumb_image && is_array( $thumb_image ) && count( $thumb_image ) >= 3 ) {
					$placeholder = porto_generate_placeholder( $thumb_image[1] . 'x' . $thumb_image[2] );
					$html       .= wp_get_attachment_image(
						$attachment_id,
						$size,
						false,
						array(
							'data-src' => esc_url( $thumb_image[0] ),
							'src'      => esc_url( $placeholder[0] ),
							'href'     => esc_url( $image_link ),
							'class'    => 'img-responsive owl-lazy',
						)
					);
				}
			} else {
				$html .= wp_get_attachment_image(
					$attachment_id,
					$size,
					false,
					array(
						'href'  => esc_url( $image_link ),
						'class' => 'img-responsive',
					)
				);
			}
			if ( ( 'grid' === $porto_product_layout || 'sticky_info' === $porto_product_layout || 'sticky_both_info' === $porto_product_layout ) && $attach_gallery_ids ) {
				$html .= '<a class="' . $image_view_cls . '" href="#"><i class="porto-icon-rotate"></i></a>';
			}
			if ( $porto_settings['product-image-popup'] && ( 'grid' === $porto_product_layout || 'sticky_info' === $porto_product_layout ) ) {
				$html .= '<a class="zoom" href="' . esc_url( $image_link ) . '"><i class="' . esc_attr( $product_icon_cl ) . '"></i></a>';
			}
			$html .= '</div></div>';

		}
	}

	$html .= '</div>';
	
	if ( ( 'default' === $porto_product_layout || 'full_width' === $porto_product_layout || 'transparent' === $porto_product_layout || 'centered_vertical_zoom' === $porto_product_layout || 'extended' === $porto_product_layout || 'left_sidebar' === $porto_product_layout ) && $attach_gallery_ids ) {
		$html .= '<a class="' . $image_view_cls . '" href="#"><i class="porto-icon-rotate"></i></a>';
	}
	if ( $porto_settings['product-image-popup'] && ( 'default' === $porto_product_layout || 'full_width' === $porto_product_layout || 'transparent' === $porto_product_layout || 'centered_vertical_zoom' === $porto_product_layout || 'extended' === $porto_product_layout || 'left_sidebar' === $porto_product_layout ) ) {
		$html .= '<span class="zoom" data-index="0"><i class="' . esc_attr( $product_icon_cl ) . '"></i></span>';
	}

	// Render contents for 360 degree view
	if ( $attach_gallery_ids ) {
		wp_enqueue_script( 'porto-360-gallery' );
		$attach_ids = json_decode( $attach_gallery_ids );
		$html .= '<div class="d-none gallery-images-wrap"><ul class="porto-360-gallery-images" data-src="';
		foreach ( $attach_ids as $key => $attach_id ) {
			if ( 0 !== $key ) {
				$html .= ',';
			}
			$html .= wp_get_attachment_image_url( $attach_id, 'full' );
		}
		$html .= '"></ul><div class="360-degree-progress-bar"></div><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 300" style="enable-background:new 0 0 300 300; fill: #808080;" xml:space="preserve"><g>
			<g>
					<path d="M99.9,95.6L92.6,94c2.2-7.3,7.6-11,15.5-11c4.7,0,8.2,0.9,10.7,3.2c2.5,2.2,4.1,5,4.1,8.8
						c0,4.7-2.5,8.2-7.9,10.1c6.3,1.6,9.1,5,9.1,11c0,4.1-1.6,7.6-4.7,9.8c-3.2,2.5-6.9,3.5-11.7,3.5c-4.4,0-7.9-0.9-11-2.8
						c-3.2-1.9-5-5-5.7-9.1l7.3-1.6c1.3,5,4.4,7.6,9.1,7.6c2.2,0,4.1-0.6,5.7-1.9c1.6-1.3,2.5-3.5,2.5-6c0-2.2-0.6-4.1-2.2-5.4
						c-1.6-1.3-4.1-2.2-7.9-2.2h-3.2v-5.4h3.2c2.2,0,3.8-0.3,5-0.6c1.3-0.3,2.2-0.9,2.8-2.2c0.6-1.3,1.3-2.5,1.3-4.4
						c0-2.2-0.6-3.8-1.9-5c-1.3-0.9-2.8-1.6-5-1.6C103.7,88.7,100.8,90.9,99.9,95.6z"/>
					<path d="M164.5,94l-6.9,1.9c-1.3-4.7-3.8-7.3-7.6-7.3c-3.2,0-5.4,1.6-6.9,4.4c-1.6,2.8-2.2,7.3-2.5,13.2
						c2.2-4.4,5.7-6.6,10.7-6.6c3.8,0,7.3,1.3,9.8,4.1s4.1,6.3,4.1,10.7c0,4.7-1.6,8.2-4.4,11s-6.6,4.1-11.4,4.1c-5,0-9.1-1.9-12-5.4
						c-3.2-3.5-4.7-9.1-4.7-17s1.6-13.9,4.7-18.3c3.2-4.1,7.3-6.3,12.6-6.3c3.5,0,6.6,0.9,9.1,2.5C161.7,87.4,163.6,90.3,164.5,94z
						M157,114.8c0-3.2-0.6-5.4-1.9-6.9c-1.3-1.6-3.2-2.2-5.4-2.2c-2.5,0-4.7,0.9-6,2.5c-1.3,1.9-2.2,3.8-2.2,6.6
						c0,2.5,0.6,4.7,2.2,6.6c1.6,1.6,3.5,2.5,6,2.5C154.5,124,157,120.8,157,114.8z"/>
					<path d="M203.3,106c0,8.5-1.3,14.5-4.1,18.3c-2.8,3.8-6.9,5.7-12.3,5.7c-11,0-16.4-7.6-16.4-23
						c0-8.5,1.3-14.5,4.1-18.3c2.8-3.8,6.9-5.7,12.3-5.7C197.7,83,203.3,90.6,203.3,106z M194.5,106.3c0-6.6-0.6-11.4-1.9-13.9
						c-1.3-2.5-3.2-4.1-6-4.1c-2.5,0-4.4,1.3-6,3.8c-1.6,2.5-1.9,7.3-1.9,13.9c0,7.3,0.6,12,2.2,14.5c1.6,2.5,3.5,3.5,5.7,3.5
						c2.5,0,4.7-1.3,6-4.1C193.9,117.7,194.5,113,194.5,106.3z"/>
					<path d="M228.2,93.7c0,2.8-0.9,5.4-3.2,7.6c-2.2,2.2-4.4,3.2-7.3,3.2c-2.8,0-5.4-0.9-7.3-3.2
						c-1.9-2.2-3.2-4.4-3.2-7.6c0-2.8,0.9-5.4,3.2-7.6c1.9-2.2,4.4-3.2,7.3-3.2c2.8,0,5.4,0.9,7.3,3.2C227,88.4,228.2,90.6,228.2,93.7z
						M222.9,93.7c0-1.9-0.6-3.2-1.6-4.4c-0.9-1.3-2.2-1.6-3.8-1.6c-1.6,0-2.5,0.6-3.8,1.9c-1.3,1.3-1.3,2.2-1.3,4.1
						c0,1.6,0.6,3.2,1.6,4.4c0.9,1.3,2.2,1.9,3.8,1.9c1.3,0,2.5-0.6,3.8-1.9C222.9,96.9,222.9,95.3,222.9,93.7z"/>
					<path d="M113.5,146.1h5.4l5,17.3l5-17.3h4.7l-7.6,24.3h-5L113.5,146.1z"/>
					<path d="M142.5,142.9h-6v-5.4h6V142.9z M136.8,146.1h5.7v24.3h-5.7V146.1z"/>
					<path d="M168.6,159h-15.5c0,3.2,0.6,5.4,1.6,6.6c0.9,0.9,2.2,1.6,3.8,1.6c2.5,0,4.1-1.6,4.7-4.4l5,0.6
						c-1.3,5-4.7,7.6-10.1,7.6c-3.2,0-6-0.9-7.9-3.2s-2.8-5-2.8-9.1c0-4.1,0.9-7.3,2.8-9.8s4.7-3.5,7.9-3.5c2.2,0,4.1,0.6,5.7,1.6
						c1.6,1.3,2.5,2.5,3.5,4.4C168,153.3,168.6,155.8,168.6,159z M163,155.5c0-4.4-1.6-6.3-4.7-6.3c-2.8,0-4.4,2.2-4.7,6.3H163z"/>
					<path d="M169.9,146.1h5.4l4.1,16.7l3.8-16.7h5l3.8,16.7l4.4-16.7h4.4l-6.6,24.3h-4.7l-4.1-16.7l-3.8,16.7h-4.7
						L169.9,146.1z"/>
				</g>
				<path d="M81.3,131.9v13.6c0,0-41,16.4,13.6,35.3c0,0,30,8.2,59.9,8.2v-11l41,19.2l-41,21.8v-13.6c0,0-106.3,0-106.3-41
					C48.5,164.4,48.5,142.6,81.3,131.9z"/>
				<path d="M201.1,178.2c2.8,0,32.8-8.2,32.8-21.8c0-13.6-11-16.4-11-16.4v-8.2c0,0,27.1,5.4,27.1,30c0,0,0,20.5-30,30
					L201.1,178.2z"/>
			</g></svg></div>';
	}
	echo apply_filters( 'woocommerce_single_product_image_html', $html, $post->ID ); // phpcs:disable WordPress.XSS.EscapeOutput.OutputNotEscaped

	?>
</div>

<?php
if ( $porto_settings['product-thumbs'] ) {
	do_action( 'woocommerce_product_thumbnails' );
}
