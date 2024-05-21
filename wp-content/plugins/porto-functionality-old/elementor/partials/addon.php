<?php
if ( ! defined( 'ABSPATH' ) ) {
	die();
}

/**
 *
 * Register elementor custom addons for elements and widgets.
 *
 * @since 2.2.0
 */

use Elementor\Controls_Manager;

/* Mouse Parallax Options */
if ( ! function_exists( 'porto_elementor_mpx_controls' ) ) :
	function porto_elementor_mpx_controls( $self ) {
		$self->start_controls_section(
			'_porto_section_floating_effect',
			array(
				'label' => __( 'Floating Effects', 'porto-functionality' ),
				'tab'   => Porto_Elementor_Editor_Custom_Tabs::TAB_CUSTOM,
			)
		);
			$self->add_control(
				'mouse_parallax',
				array(
					'label'       => esc_html__( 'Mouse Parallax?', 'porto-functionality' ),
					'type'        => Controls_Manager::SWITCHER,
					'description' => sprintf( esc_html__( 'Animate your elements chasing your mouse move. For more infomation, read this %1$sarticle%2$s.', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/mouse-parallax/" target="_blank">', '</a>' ),
				)
			);

			$self->add_control(
				'mouse_parallax_inverse',
				array(
					'label'       => esc_html__( 'Mouse Parallax Inverse?', 'porto-functionality' ),
					'type'        => Controls_Manager::SWITCHER,
					'description' => esc_html__( 'Animate your elements inversely chasing your mouse move.', 'porto-functionality' ),
					'condition'   => array(
						'mouse_parallax' => 'yes',
					),
				)
			);

			$self->add_control(
				'mouse_parallax_speed',
				array(
					'label'       => esc_html__( 'Mouse Parallax Speed', 'porto-functionality' ),
					'type'        => Controls_Manager::SLIDER,
					'description' => esc_html__( 'Control your elements mouse chasing speed.', 'porto-functionality' ),
					'default'     => array(
						'size' => '0.5',
					),
					'range'       => array(
						'' => array(
							'step' => 0.1,
							'min'  => 0,
							'max'  => 5,
						),
					),
					'condition'   => array(
						'mouse_parallax' => 'yes',
					),
				)
			);

		$self->end_controls_section();

		if ( class_exists( 'Porto_Elementor_Section' ) && $self instanceof Porto_Elementor_Section ) {
			//$self->get_data( 'isInner' )
			$self->start_controls_section(
				'_porto_section_scroll_parallax_effect',
				array(
					'label' => __( 'Scroll Parallax', 'porto-functionality' ),
					'tab'   => Porto_Elementor_Editor_Custom_Tabs::TAB_CUSTOM,
				)
			);

			$self->add_control(
				'scroll_parallax',
				array(
					'label'       => esc_html__( 'Scroll Parallax?', 'porto-functionality' ),
					'type'        => Controls_Manager::SWITCHER,
					'description' => sprintf( esc_html__( 'Section\'s width changes when scrolling page. For more infomation, read this %1$sarticle%2$s.', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/how-to-add-scroll-paralax-effect/" target="_blank">', '</a>' ),
				)
			);

			$self->add_control(
				'scroll_unit',
				array(
					'label'     => __( 'CSS Unit', 'porto-functionality' ),
					'type'      => Controls_Manager::SELECT,
					'options'   => array(
						'vw' => 'vw',
						'%'  => '%',
					),
					'default'   => 'vw',
					'condition' => array(
						'scroll_parallax' => 'yes',
					),
				)
			);

			$self->add_control(
				'scroll_parallax_width',
				array(
					'label'     => esc_html__( 'Start Width', 'porto-functionality' ),
					'type'      => Controls_Manager::SLIDER,
					'default'   => array(
						'unit' => '',
						'size' => 40,
					),
					'range'     => array(
						'' => array(
							'step' => 1,
							'min'  => 20,
							'max'  => 90,
						),
					),
					'condition' => array(
						'scroll_parallax' => 'yes',
					),
				)
			);

			$self->end_controls_section();

			$self->start_controls_section(
				'_porto_section_particles_effect',
				array(
					'label' => __( 'Particles Effect', 'porto-functionality' ),
					'tab'   => Porto_Elementor_Editor_Custom_Tabs::TAB_CUSTOM,
				)
			);

			$self->add_control(
				'particles_img',
				array(
					'type'        => Controls_Manager::MEDIA,
					'label'       => __( 'Particles Image', 'porto-functionality' ),
					'description' => sprintf( esc_html__( 'For more infomation, read this %1$sarticle%2$s.', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/how-to-add-particles-effect/" target="_blank">', '</a>' ),
					'dynamic'     => array(
						'active' => true,
					),
				)
			);

			$self->add_control(
				'particles_hover_effect',
				array(
					'label'     => __( 'Hover Effect', 'porto-functionality' ),
					'type'      => Controls_Manager::SELECT,
					'options'   => array(
						''        => __( 'None', 'porto' ),
						'grab'    => __( 'Grab', 'porto' ),
						'bubble'  => __( 'Bubble', 'porto' ),
						'repulse' => __( 'Repulse', 'porto' ),
					),
					'default'   => '',
					'condition' => array(
						'particles_img[id]!' => '',
					),
				)
			);

			$self->add_control(
				'particles_click_effect',
				array(
					'label'     => __( 'Click Effect', 'porto-functionality' ),
					'type'      => Controls_Manager::SELECT,
					'options'   => array(
						''        => __( 'None', 'porto' ),
						'grab'    => __( 'Grab', 'porto' ),
						'bubble'  => __( 'Bubble', 'porto' ),
						'repulse' => __( 'Repulse', 'porto' ),
						'push'    => __( 'Push', 'porto' ),
						'remove'  => __( 'Remove', 'porto' ),
					),
					'default'   => '',
					'condition' => array(
						'particles_img[id]!' => '',
					),
				)
			);

			$self->end_controls_section();

			$self->start_controls_section(
				'_porto_section_inviewport_effect',
				array(
					'label' => __( 'Scroll In Viewport', 'porto-functionality' ),
					'tab'   => Porto_Elementor_Editor_Custom_Tabs::TAB_CUSTOM,
				)
			);

			$self->add_control(
				'description_inviewport',
				array(
					'type'            => Controls_Manager::RAW_HTML,
					'raw'             => sprintf( esc_html__( 'Please don\'t use the background option in Style Tab.', 'porto-functionality' ), '<b>', '</b>' ),
					'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
					'condition'       => array(
						'scroll_bg_scale' => '',
					),
				)
			);

			$self->add_control(
				'scroll_inviewport',
				array(
					'label'       => esc_html__( 'Scroll Effect In Viewport?', 'porto-functionality' ),
					'type'        => Controls_Manager::SWITCHER,
					'description' => sprintf( esc_html__( 'Section\'s background color changes when scrolling page. For more infomation, read this %1$sarticle%2$s.', 'porto-functionality' ), '<a href="https://www.portotheme.com/wordpress/porto/documentation/how-to-use-scroll-in-viewport/" target="_blank">', '</a>' ),
				)
			);

			$self->add_control(
				'scroll_bg_scale',
				array(
					'label'       => esc_html__( 'Scale Background?', 'porto-functionality' ),
					'type'        => Controls_Manager::SWITCHER,
					'description' => esc_html__( 'Scale the background color when scrolling page.', 'porto-functionality' ),
					'condition'   => array(
						'scroll_inviewport' => 'yes',
					),
				)
			);

			$self->add_control(
				'scroll_bg',
				array(
					'type'        => Controls_Manager::COLOR,
					'label'       => __( 'Inside Background Color', 'porto-functionality' ),
					'description' => __( 'Actual Background Color in the viewport', 'porto-functionality' ),
					'condition'   => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => '',
					),
				)
			);

			$self->add_control(
				'scroll_bg_inout',
				array(
					'type'        => Controls_Manager::COLOR,
					'label'       => __( 'Outside Background Color', 'porto-functionality' ),
					'description' => __( 'Background Color for entering or exit', 'porto-functionality' ),
					'condition'   => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => '',
					),
				)
			);

			$self->add_control(
				'scroll_top_mode',
				array(
					'type'      => Controls_Manager::NUMBER,
					'min'       => 1,
					'max'       => 500,
					'label'     => __( 'Top Offset(px)', 'porto-functionality' ),
					'condition' => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => '',
					),
				)
			);

			$self->add_control(
				'scroll_bottom_mode',
				array(
					'type'      => Controls_Manager::NUMBER,
					'min'       => 1,
					'max'       => 500,
					'label'     => __( 'Bottom Offset(px)', 'porto-functionality' ),
					'condition' => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => '',
					),
				)
			);

			$self->add_control(
				'scale_bg',
				array(
					'type'      => Controls_Manager::COLOR,
					'label'     => __( 'Background Color', 'porto-functionality' ),
					'condition' => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => 'yes',
					),
				)
			);

			$self->add_control(
				'set_round',
				array(
					'label'       => esc_html__( 'Rounded Background?', 'porto-functionality' ),
					'type'        => Controls_Manager::SWITCHER,
					'description' => esc_html__( 'To make the shape in a circle when scrolling page.', 'porto-functionality' ),
					'condition'   => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => 'yes',
					),
				)
			);

			$self->add_control(
				'scale_extra_class',
				array(
					'type'      => Controls_Manager::TEXT,
					'label'     => __( 'Extra Class', 'porto-functionality' ),
					'condition' => array(
						'scroll_inviewport' => 'yes',
						'scroll_bg_scale'   => 'yes',
					),
				)
			);

			$self->end_controls_section();
		}
	}
endif;
