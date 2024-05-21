<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Porto Elementor Custom Product Linked Products Widget
 *
 * Porto Elementor widget to display Linked products on the single product page when using custom product layout
 *
 * @since 2.3.0
 */

use Elementor\Controls_Manager;

class Porto_Elementor_CP_Linked_Widget extends Porto_Elementor_Posts_Grid_Widget {

	public function get_name() {
		return 'porto_cp_linked';
	}

	public function get_title() {
		return __( 'Linked Products', 'porto-functionality' );
	}

	public function get_categories() {
		return array( 'custom-product' );
	}

	public function get_keywords() {
		return array( 'product', 'linked', 'related', 'upsell' );
	}

	protected function register_controls() {
		parent::register_controls();
		
		$this->start_controls_section(
			'section_heading',
			array(
				'label' => __( 'Heading', 'porto-functionality' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

			$this->add_control(
				'show_heading',
				array(
					'type'    => Controls_Manager::SWITCHER,
					'label'   => __( 'Show Title', 'porto-functionality' ),
				)
			);

			$this->add_control(
				'heading_text',
				array(
					'type'      => Controls_Manager::TEXT,
					'label'     => __( 'Heading Content', 'porto-functionality' ),
					'default'   => __( 'Related Products', 'porto-functionality' ),
					'condition' => array(
						'show_heading' => 'yes',
					)
				)
			);

			$this->add_group_control(
				Elementor\Group_Control_Typography::get_type(),
				array(
					'name'      => 'hd_typography',
					'scheme'    => Elementor\Core\Schemes\Typography::TYPOGRAPHY_1,
					'label'     => __( 'Heading Typography', 'porto-functionality' ),
					'selector'  => '.elementor-element-{{ID}} .sp-linked-heading',
					'condition' => array(
						'show_heading' => 'yes',
					)
				)
			);

			$this->add_control(
				'hd_space',
				array(
					'type'        => Controls_Manager::SLIDER,
					'label'       => __( 'Bottom Space of Heading', 'porto-functionality' ),
					'qa_selector' => '.sp-linked-heading',
					'range'       => array(
						'px' => array(
							'step' => 1,
							'min'  => 0,
							'max'  => 72,
						),
						'rem' => array(
							'step' => 0.1,
							'min'  => 0,
							'max'  => 5,
						),
						'em' => array(
							'step' => 0.1,
							'min'  => 0,
							'max'  => 5,
						),
					),
					'size_units'  => array(
						'px',
						'rem',
						'em',
					),
					'selectors'   => array(
						'.elementor-element-{{ID}} .sp-linked-heading' => "padding-bottom: {{SIZE}}{{UNIT}};",
					),
					'condition'   => array(
						'show_heading' => 'yes',
					)
				)
			);
			
			$this->add_control(
				'separator_space',
				array(
					'type'  => Controls_Manager::SLIDER,
					'label' => __( 'Bottom Space of Separator', 'porto-functionality' ),
					'range'       => array(
						'px' => array(
							'step' => 1,
							'min'  => 0,
							'max'  => 72,
						),
						'rem' => array(
							'step' => 0.1,
							'min'  => 0,
							'max'  => 5,
						),
						'em' => array(
							'step' => 0.1,
							'min'  => 0,
							'max'  => 5,
						),
					),
					'size_units'  => array(
						'px',
						'rem',
						'em',
					),
					'selectors'   => array(
						'.elementor-element-{{ID}} .sp-linked-heading' => "margin-bottom: {{SIZE}}{{UNIT}};",
					),
					'condition' => array(
						'show_heading' => 'yes',
					)
				)
			);

		$this->end_controls_section();

		$this->remove_control( 'source' );
		$this->update_control(
			'post_type',
			array(
				'type'        => Controls_Manager::SELECT,
				'label'       => esc_html__( 'Linked Type', 'porto-functionality' ),
				'description' => esc_html__( 'Please select a product type of products to display related or upsell products', 'porto-functionality' ),
				'default'     => 'related',
				'options'     => array(
					'related' => esc_html__( 'Related Products', 'porto-functionality' ),
					'upsell'  => esc_html__( 'Upsells Products', 'porto-functionality' ),
				),
				'condition'   => array(),
			)
		);
		$this->remove_control( 'tax' );
		$this->remove_control( 'post_ids' );
		$this->remove_control( 'terms' );
		$this->remove_control( 'post_terms' );
		$this->remove_control( 'post_tax' );
		$this->update_control(
			'orderby',
			array(
				'type'        => Controls_Manager::SELECT,
				'label'       => __( 'Order by', 'porto-functionality' ),
				'options'     => array_flip( array_slice( porto_vc_woo_order_by(), 1 ) ),
				'description' => __( 'Price, Popularity and Rating values only work for product post type.', 'porto-functionality' ),
				'condition'   => array(),
			)
		);
		$this->remove_control( 'pagination_style' );
		$this->remove_control( 'category_filter' );

	}

	protected function render() {

		$atts = $this->get_settings_for_display();
		echo PortoCustomProduct::get_instance()->shortcode_single_product_linked( $atts, 'elementor' );
	}
}
