( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	$.extend( theme, {
		mfpConfig: {
			tClose: js_porto_vars.popup_close,
			tLoading: '<div class="porto-ajax-loading"><i class="porto-loading-icon"></i></div>',
			gallery: {
				tPrev: js_porto_vars.popup_prev,
				tNext: js_porto_vars.popup_next,
				tCounter: js_porto_vars.mfp_counter
			},
			image: {
				tError: js_porto_vars.mfp_img_error
			},
			ajax: {
				tError: js_porto_vars.mfp_ajax_error
			},
			callbacks: {
				open: function() {
					$( 'body' ).addClass( 'lightbox-opened' );
					var fixed = this.st.fixedContentPos;
					if ( fixed ) {
						$( '#header.sticky-header .header-main.sticky, #header.sticky-header .main-menu-wrap, .fixed-header #header.sticky-header .header-main, .fixed-header #header.sticky-header .main-menu-wrap' ).css( theme.rtl_browser ? 'left' : 'right', theme.getScrollbarWidth() );
					}
					/* D3-Ahsan - Start */
					var that = $( this._lastFocusedEl );
					if ( ( that.closest( '.portfolios-lightbox' ).hasClass( 'with-thumbs' ) ) && $( document ).width() >= 1024 ) {

						var portfolio_lightbox_thumbnails_base = that.closest( '.portfolios-lightbox.with-thumbs' ).find( '.porto-portfolios-lighbox-thumbnails' ).clone(),
							magnificPopup = $.magnificPopup.instance;

						$( 'body' ).prepend( portfolio_lightbox_thumbnails_base );

						var $portfolios_lightbox_thumbnails = $( 'body > .porto-portfolios-lighbox-thumbnails' ),
							$portfolios_lightbox_thumbnails_carousel = $portfolios_lightbox_thumbnails.children( '.owl-carousel' );
						$portfolios_lightbox_thumbnails_carousel.themeCarousel( $portfolios_lightbox_thumbnails_carousel.data( 'plugin-options' ) );
						$portfolios_lightbox_thumbnails_carousel.trigger( 'refresh.owl.carousel' );

						var $carousel_items_wrapper = $portfolios_lightbox_thumbnails_carousel.find( '.owl-stage' );

						$carousel_items_wrapper.find( '.owl-item' ).removeClass( 'current' );
						$carousel_items_wrapper.find( '.owl-item' ).eq( magnificPopup.currItem.index ).addClass( 'current' );

						$.magnificPopup.instance.next = function() {
							var magnificPopup = $.magnificPopup.instance;
							$.magnificPopup.proto.next.call( this );
							$carousel_items_wrapper.find( '.owl-item' ).removeClass( 'current' );
							$carousel_items_wrapper.find( '.owl-item' ).eq( magnificPopup.currItem.index ).addClass( 'current' );
						};

						$.magnificPopup.instance.prev = function() {
							var magnificPopup = $.magnificPopup.instance;
							$.magnificPopup.proto.prev.call( this );
							$carousel_items_wrapper.find( '.owl-item' ).removeClass( 'current' );
							$carousel_items_wrapper.find( '.owl-item' ).eq( magnificPopup.currItem.index ).addClass( 'current' );
						};

						$carousel_items_wrapper.find( '.owl-item' ).on( 'click', function() {
							$carousel_items_wrapper.find( '.owl-item' ).removeClass( 'current' );
							$.magnificPopup.instance.goTo( $( this ).index() );
							$( this ).addClass( 'current' );
						} );

					}
					/* End - D3-Ahsan */
				},
				close: function() {
					$( 'body' ).removeClass( 'lightbox-opened' );
					var fixed = this.st.fixedContentPos;
					if ( fixed ) {
						$( '#header.sticky-header .header-main.sticky, #header.sticky-header .main-menu-wrap, .fixed-header #header.sticky-header .header-main, .fixed-header #header.sticky-header .main-menu-wrap' ).css( theme.rtl_browser ? 'left' : 'right', '' );
					}
					$( '.owl-carousel .owl-stage' ).each( function() {
						var $this = $( this ),
							w = $this.width() + parseInt( $this.css( 'padding-left' ) ) + parseInt( $this.css( 'padding-right' ) );

						$this.css( { 'width': w + 200 } );
						setTimeout( function() {
							$this.css( { 'width': w } );
						}, 0 );
					} );
					/* D3-Ahsan - Start */
					var that = $( this._lastFocusedEl );
					if ( ( that.parents( '.portfolios-lightbox' ).hasClass( 'with-thumbs' ) ) && $( document ).width() >= 1024 ) {
						$( ' body > .porto-portfolios-lighbox-thumbnails' ).remove();
					}
					/* End - D3-Ahsan */
				}
			}
		},
	} );

} ).apply( this, [window.theme, jQuery] );

// Search
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	$.extend( theme, {

		Search: {

			defaults: {
				popup: $( '.searchform-popup' ),
				form: $( '.searchform' )
			},

			initialize: function( $popup, $form ) {
				this.$popup = ( $popup || this.defaults.popup );
				this.$form = ( $form || this.defaults.form );
				this.form_layout = this.$form.hasClass( 'search-layout-overlay' ) ? 'overlay' : this.$form.hasClass( 'search-layout-reveal' ) ? 'reveal' : false;

				this.build()
					.events();

				return this;
			},

			build: function() {
				var self = this;

				/* Change search form values */
				var $search_form_texts = self.$form.find( '.text input' ),
					$search_form_cats = self.$form.find( '.cat' );

				if ( $( '.searchform .cat' ).get( 0 ) && $.fn.selectric ) {
					$( '.searchform .cat' ).selectric( {
						arrowButtonMarkup: '',
						expandToItemText: true,
						maxHeight: 240
					} );
				}

				$search_form_texts.on( 'change', function() {
					var $this = $( this ),
						val = $this.val();

					$search_form_texts.each( function() {
						if ( $this != $( this ) ) $( this ).val( val );
					} );
				} );

				$search_form_cats.on( 'change', function() {
					var $this = $( this ),
						val = $this.val();

					$search_form_cats.each( function() {
						if ( $this != $( this ) ) $( this ).val( val );
					} );
				} );

				return this;
			},

			events: function() {
				var self = this;

				self.$popup.on( 'click', function( e ) {
					e.stopPropagation();
				} );
				self.$popup.find( '.search-toggle' ).off( 'click' ).on( 'click', function( e ) {
					var $this = $( this ),
						$form = $this.next();
					$this.toggleClass( 'opened' );
					if ( 'overlay' == self.form_layout ) {
						$( 'html' ).toggleClass( 'porto-search-opened' );
						$this.closest( '.vc_row.vc_row-flex>.vc_column_container>.vc_column-inner' ).css( 'z-index', '999' );
					} else if ( 'reveal' == self.form_layout  ) {
						self.parents = [];
						var $element = self.$popup;
						while ( ! ( ( $element.hasClass( 'elementor-container' ) && ! $element.parent().hasClass( 'elementor-inner-container' ) ) || ( $element.parent().hasClass( 'vc_row' ) && ! $element.parent().hasClass( 'vc_inner' ) ) || 'header' == $element.parent().attr( 'id' ) || $element.parent().hasClass( 'header-main' ) || $element.parent().hasClass( 'header-top' ) || $element.parent().hasClass( 'header-bottom' ) ) ) {
							$element = $element.parent();
							$element.addClass( 'position-static' );
							self.parents.push( $element );
						}
						if ( 'static' == $element.parent().css( 'position' ) ) {
							self.topParent = $element.parent();
							self.topParent.addClass( 'position-relative' );
						}
						$form.toggle();
						window.setTimeout( function () {
							$( 'body' ).toggleClass( 'porto-search-opened' );
						}, 100 );
					} else {
						$form.toggle();
					}
					if ( $this.hasClass( 'opened' ) ) {
						$( '#mini-cart.open' ).removeClass( 'open' );
						$this.next().find( 'input[type="text"]' ).focus();
						if ( self.$popup.find( '.btn-close-search-form' ).length ) {
							self.$popup.parent().addClass( 'position-static' );
						}
					} else if ( 'reveal' == self.form_layout ) {
						self.removeFormStyle();
					}
					e.preventDefault();
					e.stopPropagation();
				} );

				$( 'html,body' ).on( 'click', function() {
					self.removeFormStyle();
				} );

				if ( !( 'ontouchstart' in document ) ) {

					$( window ).on( 'resize', function() {
						self.removeFormStyle();
					} );
				}

				$( '.btn-close-search-form' ).on( 'click', function( e ) {
					e.preventDefault();
					self.removeFormStyle();
				} );

				return self;
			},

			removeFormStyle: function() {
				this.$form.removeAttr( 'style' );
				var $searchToggle = this.$popup.find( '.search-toggle' );
				$searchToggle.removeClass( 'opened' );
				if ( 'overlay' == this.form_layout ) {
					$( 'html' ).removeClass( 'porto-search-opened' );
					$searchToggle.closest( '.vc_row.vc_row-flex>.vc_column_container>.vc_column-inner' ).css( 'z-index', '' );
				} else if ( 'reveal' == this.form_layout && this.parents && this.parents.length >= 1 ) {
					$( 'body' ).removeClass( 'porto-search-opened' );
					this.parents.forEach( $element => {
						$element.removeClass( 'position-static' );
					});
					if ( this.topParent ) {
						this.topParent.removeClass( 'position-relative' );
					}
				}
				if ( this.$popup.find( '.btn-close-search-form' ).length ) {
					this.$popup.parent().removeClass( 'position-static' );
				}
			}
		}

	} );

} ).apply( this, [window.theme, jQuery] );


// Animate
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	var instanceName = '__animate';

	var Animate = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	Animate.defaults = {
		accX: 0,
		accY: -120,
		delay: 1,
		duration: 1000
	};

	Animate.prototype = {
		initialize: function( $el, opts ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions( opts )
				.build();

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, true );

			return this;
		},

		setOptions: function( opts ) {
			this.options = $.extend( true, {}, Animate.defaults, opts, {
				wrapper: this.$el
			} );

			return this;
		},

		build: function() {
			var self = this,
				$el = this.options.wrapper,
				delay = 0,
				duration = 0;

			if ( $el.data( 'appear-animation-svg' ) ) {
				$el.find( '[data-appear-animation]' ).each( function() {
					var $this = $( this ),
						opts;

					var pluginOptions = theme.getOptions( $this.data( 'plugin-options' ) );
					if ( pluginOptions )
						opts = pluginOptions;

					$this.themeAnimate( opts );
				} );

				return this;
			}

			$el.addClass( 'appear-animation' );

			var el_obj = $el.get( 0 );

			delay = Math.abs( $el.data( 'appear-animation-delay' ) ? $el.data( 'appear-animation-delay' ) : self.options.delay );
			duration = Math.abs( $el.data( 'appear-animation-duration' ) ? $el.data( 'appear-animation-duration' ) : self.options.duration );
			if ( 'undefined' !== typeof $el.data( 'appear-animation' ) && $el.data( 'appear-animation' ).includes( 'revealDir' ) ) {
				if ( delay > 1 ) {
					el_obj.style.setProperty( '--porto-reveal-animationDelay', delay + 'ms' );
				}
				if ( duration != 1000 ) {
					el_obj.style.setProperty( '--porto-reveal-animationDuration', duration + 'ms' );
				}
				if ( $el.data( 'animation-reveal-clr' ) ) {
					el_obj.style.setProperty(  '--porto-reveal-clr', $el.data( 'animation-reveal-clr' ) );
				}
			} else {
				if ( delay > 1 ) {
					el_obj.style.animationDelay = delay + 'ms';
				}
				if ( duration != 1000 ) {
					el_obj.style.animationDuration = duration + 'ms';
				}				
			}

			/*if ( $el.find( '.porto-lazyload:not(.lazy-load-loaded)' ).length ) {
				$el.find( '.porto-lazyload:not(.lazy-load-loaded)' ).trigger( 'appear' );
			}*/
			$el.addClass( $el.data( 'appear-animation' ) + ' appear-animation-visible' );

			return this;
		}
	};

	// expose to scope
	$.extend( theme, {
		Animate: Animate
	} );

	// jquery plugin
	$.fn.themeAnimate = function( opts ) {
		return this.map( function() {
			var $this = $( this );

			if ( $this.data( instanceName ) ) {
				return $this;
			} else {
				return new theme.Animate( $this, opts );
			}

		} );
	};

} ).apply( this, [window.theme, jQuery] );

// Animated Letters
( function( theme, $ ) {

	theme = theme || {};

	var instanceName = '__animatedLetters';

	var PluginAnimatedLetters = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	PluginAnimatedLetters.defaults = {
		contentType: 'letter',
		animationName: 'typeWriter',
		animationSpeed: 50,
		startDelay: 500,
		minWindowWidth: 768,
		letterClass: '',
		wordClass: ''
	};

	PluginAnimatedLetters.prototype = {
		initialize: function( $el, opts ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			var self = this;

			this.$el = $el;
			this.initialText = $el.text();
			this.timeoutId = null;
			this
				.setData()
				.setOptions( opts )
				.build()
				.events();

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, this );

			return this;
		},

		setOptions: function( opts ) {
			this.options = $.extend( true, {}, PluginAnimatedLetters.defaults, opts, {
				wrapper: this.$el
			} );

			return this;
		},

		build: function() {
			var self = this,
				letters = self.$el.text().split( '' );

			if ( $( window ).width() < self.options.minWindowWidth ) {
				self.$el.addClass( 'initialized' );
				return this;
			}

			if ( self.options.firstLoadNoAnim ) {
				self.$el.css( {
					visibility: 'visible'
				} );

				// Inside Carousel
				if ( self.$el.closest( '.owl-carousel' ).get( 0 ) ) {
					setTimeout( function() {
						self.$el.closest( '.owl-carousel' ).on( 'change.owl.carousel', function() {
							self.options.firstLoadNoAnim = false;
							self.build();
						} );
					}, 500 );
				}

				return this;
			}

			// Add class to show
			self.$el.addClass( 'initialized' );

			// Set Min Height to avoid flicking issues
			self.setMinHeight();
			if ( self.options.contentType == 'letter' ) {
				self.$el.text( '' );
				if ( self.options.animationName == 'typeWriter' ) {
					self.$el.append( '<span class="letters-wrapper"></span><span class="typeWriter"></pre>' );

					var index = 0;
					var timeout = function() {
						var st = setTimeout( function() {
							var letter = letters[index];

							self.$el.find( '.letters-wrapper' ).append( '<span class="letter ' + ( self.options.letterClass ? self.options.letterClass + ' ' : '' ) + '">' + letter + '</span>' );

							index++;
							timeout();
						}, self.options.animationSpeed );

						if ( index >= letters.length ) {
							clearTimeout( st );
						}
					};
					timeout();
				} else {
					this.timeoutId = setTimeout( function() {
						for ( var i = 0; i < letters.length; i++ ) {
							var letter = letters[i];

							self.$el.append( '<span class="letter ' + ( self.options.letterClass ? self.options.letterClass + ' ' : '' ) + self.options.animationName + ' animated" style="animation-delay: ' + ( i * self.options.animationSpeed ) + 'ms;">' + ( letter
								== ' ' ? '&nbsp;' : letter ) + '</span>' );

						}
					}, self.options.startDelay );
				}
			} else if ( self.options.contentType == 'word' ) {
				var words = self.$el.text().split( " " ),
					delay = self.options.startDelay;

				self.$el.empty();

				$.each( words, function( i, v ) {
					self.$el.append( $( '<span class="animated-words-wrapper">' ).html( '<span class="animated-words-item ' + self.options.wordClass + ' appear-animation" data-appear-animation="' + self.options.animationName + '" data-appear-animation-delay="' + delay + '">' + v + '&nbsp;</span>' ) );
					delay = delay + self.options.animationSpeed;
				} );

				if ( $.isFunction( $.fn['themeAnimate'] ) && self.$el.find( '.animated-words-item[data-appear-animation]' ).length ) {

					self.$el.find( '[data-appear-animation]' ).each( function() {
						var $this = $( this ),
							opts;

						var pluginOptions = theme.getOptions( $this.data( 'plugin-options' ) );
						if ( pluginOptions )
							opts = pluginOptions;

						$this.themeAnimate( opts );
					} );
				}

				self.$el.addClass( 'initialized' );
			}
			return this;
		},

		setMinHeight: function() {
			var self = this;

			// if it's inside carousel
			if ( self.$el.closest( '.owl-carousel' ).get( 0 ) ) {
				self.$el.closest( '.owl-carousel' ).addClass( 'd-block' );
				self.$el.css( 'min-height', self.$el.height() );
				self.$el.closest( '.owl-carousel' ).removeClass( 'd-block' );
			} else {
				self.$el.css( 'min-height', self.$el.height() );
			}

			return this;
		},

		destroy: function() {
			var self = this;

			self.$el
				.html( self.initialText )
				.css( 'min-height', '' );
			if ( this.timeoutId ) {
				clearTimeout( this.timeoutId );
				this.timeoutId = null;
			}
			return this;
		},

		events: function() {
			var self = this;

			// Destroy
			self.$el.on( 'animated.letters.destroy', function() {
				self.destroy();
			} );

			// Initialize
			self.$el.on( 'animated.letters.initialize', function() {
				self.build();
			} );

			return this;
		}
	};

	// expose to scope
	$.extend( theme, {
		PluginAnimatedLetters: PluginAnimatedLetters
	} );

	// jquery plugin
	$.fn.themePluginAnimatedLetters = function( opts ) {
		return this.map( function() {
			var $this = $( this );

			if ( $this.data( instanceName ) ) {
				return $this.data( instanceName );
			} else {
				return new PluginAnimatedLetters( $this, opts );
			}

		} );
	}

} ).apply( this, [window.theme, jQuery] );

// Carousel
if ( typeof jQuery.fn.owlCarousel == 'function' ) {
	( function( theme, $ ) {
		'use strict';

		theme = theme || {};

		var instanceName = '__carousel';

		var Carousel = function( $el, opts ) {
			return this.initialize( $el, opts );
		};

		Carousel.defaults = $.extend( {}, {
			loop: true,
			navText: [],
			themeConfig: false,
			lazyLoad: true,
			lg: 0,
			md: 0,
			sm: 0,
			xs: 0,
			single: false,
			rtl: theme.rtl
		} );

		Carousel.prototype = {
			initialize: function( $el, opts ) {
				if ( $el.data( instanceName ) ) {
					return this;
				}

				this.$el = $el;

				this
					.setData()
					.setOptions( opts )
					.build();

				return this;
			},

			setData: function() {
				this.$el.data( instanceName, true );

				return this;
			},

			setOptions: function( opts ) {
				if ( ( opts && opts.themeConfig ) || !opts ) {
					this.options = $.extend( true, {}, Carousel.defaults, theme.owlConfig, opts, {
						wrapper: this.$el,
						themeConfig: true
					} );
				} else {
					this.options = $.extend( true, {}, Carousel.defaults, opts, {
						wrapper: this.$el
					} );
				}

				return this;
			},

			calcOwlHeight: function( $el ) {
				var h = 0;
				$el.find( '.owl-item.active' ).each( function() {
					if ( h < $( this ).height() )
						h = $( this ).height();
				} );
				$el.children( '.owl-stage-outer' ).height( h );
			},

			build: function() {
				if ( !$.fn.owlCarousel ) {
					return this;
				}

				var $el = this.options.wrapper,
					loop = this.options.loop,
					lg = this.options.lg,
					md = this.options.md,
					sm = this.options.sm,
					xs = this.options.xs,
					single = this.options.single,
					zoom = $el.find( '.zoom' ).filter( function() {
						if ( $( this ).closest( '.tb-image-type-slider' ).length ) {
							return false;
						}
						return true;
					} ).get( 0 ),
					responsive = {},
					items,
					count = $el.find( '.owl-item' ).length > 0 ? $el.find( '.owl-item:not(.cloned)' ).length : $el.find( '> *' ).length,
					fullscreen = typeof this.options.fullscreen == 'undefined' ? false : this.options.fullscreen;


				/*if (fullscreen) {
					$el.children().width(window.innerWidth - theme.getScrollbarWidth());
					$el.children().height($el.closest('.fullscreen-carousel').length ? $el.closest('.fullscreen-carousel').height() : window.innerHeight);
					$el.children().css('max-height', '100%');
					$(window).on('resize', function() {
						$el.find('.owl-item').children().width(window.innerWidth - theme.getScrollbarWidth());
						$el.find('.owl-item').children().height($el.closest('.fullscreen-carousel').length ? $el.closest('.fullscreen-carousel').height() : window.innerHeight);
						$el.find('.owl-item').children().css('max-height', '100%');
					});
				}*/

				if ( single ) {
					items = 1;
				} else if ( typeof this.options.responsive != 'undefined' ) {
					for ( var w in this.options.responsive ) {
						var number_items = Number( this.options.responsive[w] );
						responsive[Number( w )] = { items: number_items, loop: ( loop && count >= number_items ) ? true : false };
					}
				} else {
					items = this.options.items ? this.options.items : ( lg ? lg : 1 );
					var isResponsive = ( this.options.xxl || this.options.xl || lg || md || sm || xs );
					if ( isResponsive ) {
						if ( this.options.xxl ) {
							responsive[theme.screen_xxl] = { items: this.options.xxl, loop: ( loop && count > this.options.xxl ) ? true : false, mergeFit: this.options.mergeFit };
						} else if ( lg && items > lg + 1 ) {
							responsive[theme.screen_xxl] = { items: items, loop: ( loop && count > items ) ? true : false, mergeFit: this.options.mergeFit };
							responsive[theme.screen_xl] = { items: lg + 1, loop: ( loop && count > lg + 1 ) ? true : false, mergeFit: this.options.mergeFit };
						}
						if ( this.options.xl ) {
							responsive[theme.screen_xl] = { items: this.options.xl, loop: ( loop && count > this.options.xl ) ? true : false, mergeFit: this.options.mergeFit };
						} else if ( typeof responsive[theme.screen_xl] == 'undefined' && ( ! lg || items != lg ) ) {
							responsive[theme.screen_xl] = { items: items, loop: ( loop && count >= items ) ? true : false, mergeFit: this.options.mergeFit };
						}
						if ( lg ) responsive[992] = { items: lg, loop: ( loop && count >= lg ) ? true : false, mergeFit: this.options.mergeFit_lg };
						if ( md ) responsive[768] = { items: md, loop: ( loop && count > md ) ? true : false, mergeFit: this.options.mergeFit_md };
						if ( sm ) {
							responsive[576] = { items: sm, loop: ( loop && count > sm ) ? true : false, mergeFit: this.options.mergeFit_sm };
						} else {
							if ( xs && xs > 1 )  {
								responsive[576] = { items: xs, loop: ( loop && count > xs ) ? true : false, mergeFit: this.options.mergeFit_sm };
							} else {
								responsive[576] = { items: 1, mergeFit: false };
							}
						}
						if ( xs ) {
							responsive[0] = { items: xs, loop: ( loop && count > xs ) ? true : false, mergeFit: this.options.mergeFit_xs };
						} else {
							responsive[0] = { items: 1 };
						}
					}
				}

				if ( !$el.hasClass( 'show-nav-title' ) && this.options.themeConfig && theme.slider_nav && theme.slider_nav_hover ) {
					$el.addClass( 'show-nav-hover' );
				}

				this.options = $.extend( true, {}, this.options, {
					items: items,
					loop: ( loop && count > items ) ? true : false,
					responsive: responsive,
					onInitialized: function() {
						if ( $el.hasClass( 'stage-margin' ) ) {
							$el.find( '.owl-stage-outer' ).css( {
								'margin-left': this.options.stagePadding,
								'margin-right': this.options.stagePadding
							} );
						}
						var heading_cls = '.porto-u-heading, .vc_custom_heading, .slider-title, .elementor-widget-heading, .porto-heading';
						if ( $el.hasClass( 'show-dots-title' ) && ( $el.prev( heading_cls ).length || $el.closest( '.slider-wrapper' ).prev( heading_cls ).length || $el.closest( '.porto-recent-posts' ).prev( heading_cls ).length || $el.closest( '.elementor-widget-porto_recent_posts, .elementor-section' ).prev( heading_cls ).length ) ) {
							var $obj = $el.prev( heading_cls );
							if ( !$obj.length ) {
								$obj = $el.closest( '.slider-wrapper' ).prev( heading_cls );
							}
							if ( !$obj.length ) {
								$obj = $el.closest( '.porto-recent-posts' ).prev( heading_cls );
							}
							if ( !$obj.length ) {
								$obj = $el.closest( '.elementor-widget-porto_recent_posts, .elementor-section' ).prev( heading_cls );
							}
							try {
								var innerWidth = $obj.addClass( 'w-auto' ).css( 'display', 'inline-block' ).width();
								$obj.removeClass( 'w-auto' ).css( 'display', '' );
								if ( innerWidth + 15 + $el.find( '.owl-dots' ).width() <= $obj.width() ) {
									$el.find( '.owl-dots' ).css( ( $( 'body' ).hasClass( 'rtl' ) ? 'right' : 'left' ), innerWidth + 15 + ( $el.width() - $obj.width() ) / 2 );
									$el.find( '.owl-dots' ).css( 'top', -1 * $obj.height() / 2 - parseInt( $obj.css( 'margin-bottom' ) ) - $el.find( '.owl-dots' ).height() / 2 + 2 );
								} else {
									$el.find( '.owl-dots' ).css( 'position', 'static' );
								}
							} catch ( e ) { }
						}
					}
				} );

				// Auto Height Fixes
				if ( this.options.autoHeight ) {
					var thisobj = this;
					$( window ).on( 'resize', function() {
						thisobj.calcOwlHeight( $el );
					} );

					if ( theme.isLoaded ) {
						setTimeout( function() {
							thisobj.calcOwlHeight( $el );
						}, 100 );
					} else {
						$( window ).on( 'load', function() {
							thisobj.calcOwlHeight( $el );
						} );
					}
				}

				var links = false;
				if ( zoom ) {
					links = [];
					var i = 0;

					$el.find( '.zoom' ).each( function() {
						var slide = {},
							$zoom = $( this );

						slide.src = $zoom.data( 'src' ) ? $zoom.data( 'src' ) : $zoom.data( 'mfp-src' );
						slide.title = $zoom.data( 'title' );
						links[i] = slide;
						$zoom.data( 'index', i );
						i++;
					} );
				}

				if ( $el.hasClass( 'show-nav-title' ) ) {
					this.options.stagePadding = 0;
				} else {
					if ( this.options.themeConfig && theme.slider_nav && theme.slider_nav_hover )
						$el.addClass( 'show-nav-hover' );
					if ( this.options.themeConfig && !theme.slider_nav_hover && theme.slider_margin )
						$el.addClass( 'stage-margin' );
				}
				if ( $el.hasClass( 'has-ccols-spacing' ) ) {
					$el.removeClass( 'has-ccols-spacing' );
				}
				$el.owlCarousel( this.options );

				if ( zoom && links ) {
					$el.on( 'click', '.zoom', function( e ) {
						e.preventDefault();
						if ( $.fn.magnificPopup ) {
							var image_index = $( this ).data( 'index' );
							if ( typeof image_index == 'undefined' ) {
								image_index = ( $( this ).closest( '.owl-item' ).index() - $el.find( '.cloned' ).length / 2 ) % $el.data( 'owl.carousel' ).items().length;
							}
							$.magnificPopup.close();
							$.magnificPopup.open( $.extend( true, {}, theme.mfpConfig, {
								items: links,
								gallery: {
									enabled: true
								},
								type: 'image'
							} ), image_index );
						}
						return false;
					} );
				}

				return this;
			}
		}
		// expose to scope
		$.extend( theme, {
			Carousel: Carousel
		} );

		// jquery plugin
		$.fn.themeCarousel = function( opts, zoom ) {
			return this.map( function() {
				var $this = $( this );

				if ( $this.data( instanceName ) ) {
					return $this;
				} else {
					return new theme.Carousel( $this, opts, zoom );
				}

			} );
		}

	} ).apply( this, [window.theme, jQuery] );
}

// Lightbox
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	var instanceName = '__lightbox';

	var Lightbox = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	Lightbox.defaults = {
		callbacks: {
			open: function() {
				$( 'body' ).addClass( 'lightbox-opened' );
			},
			close: function() {
				$( 'body' ).removeClass( 'lightbox-opened' );
			}
		}
	};

	Lightbox.prototype = {
		initialize: function( $el, opts ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions( opts )
				.build();

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, this );

			return this;
		},

		setOptions: function( opts ) {
			this.options = $.extend( true, {}, Lightbox.defaults, theme.mfpConfig, opts, {
				wrapper: this.$el
			} );

			return this;
		},

		build: function() {
			if ( !$.fn.magnificPopup ) {
				return this;
			}

			this.options.wrapper.magnificPopup( this.options );

			return this;
		}
	};

	// expose to scope
	$.extend( theme, {
		Lightbox: Lightbox
	} );

	// jquery plugin
	$.fn.themeLightbox = function( opts ) {
		return this.map( function() {
			var $this = $( this );

			if ( $this.data( instanceName ) ) {
				return $this.data( instanceName );
			} else {
				return new theme.Lightbox( $this, opts );
			}

		} );
	}

} ).apply( this, [window.theme, jQuery] );

// Visual Composer Image Zoom
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	var instanceName = '__toggle';

	var VcImageZoom = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	VcImageZoom.defaults = {

	};

	VcImageZoom.prototype = {
		initialize: function( $el, opts ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions( opts )
				.build();

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, this );

			return this;
		},

		setOptions: function( opts ) {
			this.options = $.extend( true, {}, VcImageZoom.defaults, opts, {
				wrapper: this.$el
			} );

			return this;
		},

		build: function() {
			var self = this,
				$el = this.options.container;
			$el.parent().magnificPopup( $.extend( true, {}, theme.mfpConfig, {
				delegate: ".porto-vc-zoom",
				gallery: {
					enabled: true
				},
				mainClass: 'mfp-with-zoom',
				zoom: {
					enabled: true,
					duration: 300
				},
				type: 'image'
			} ) );

			return this;
		}
	};

	// expose to scope
	$.extend( theme, {
		VcImageZoom: VcImageZoom
	} );

	// jquery plugin
	$.fn.themeVcImageZoom = function( opts ) {
		return this.map( function() {
			var $this = $( this );

			if ( $this.data( instanceName ) ) {
				return $this.data( instanceName );
			} else {
				return new theme.VcImageZoom( $this, opts );
			}

		} );
	}

} ).apply( this, [window.theme, jQuery] );


// Post Filter
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	$.extend( theme, {

		PostFilter: {

			cache: {
			},

			defaults: {
				elements: '.portfolio-filter'
			},

			initialize: function( $elements, post_type ) {
				this.$elements = ( $elements || $( this.defaults.elements ) );
				this.build( post_type );

				return this;
			},

			filterFn: function( e ) {
				if ( typeof e == 'undefined' || typeof e.data == 'undefined' || typeof e.data.elements == 'undefined' || !e.data.elements || !e.data.elements.length ) {
					return;
				}
				var self = e.data.selfobj;

				if ( self.isLoading ) {
					return false;
				}
				var $this = e.data.thisobj,
					$elements = e.data.elements,
					position = e.data.position,
					post_type = e.data.post_type,
					$parent = e.data.parent,
					$posts_wrap = e.data.posts_wrap,
					use_ajax = e.data.use_ajax,
					page_path = e.data.page_path,
					infinite_load = e.data.infinite_load,
					load_more = e.data.load_more;
				e.preventDefault();
				if ( $( this ).hasClass( 'active' ) ) {
					return;
				}

				self.isLoading = true;
				var selector = $( this ).attr( 'data-filter' );
				if ( 'sidebar' == position ) {
					$( '.sidebar-overlay' ).trigger( 'click' );
				}

				$this.find( '.active' ).removeClass( 'active' );

				if ( use_ajax ) {
					var current_cat = '*' == selector ? '' : selector;
					if ( !page_path ) {
						page_path = $posts_wrap.data( 'page_path' );
					}
					if ( page_path ) {
						$posts_wrap.data( 'page_path', page_path.replace( /&category=[^&]*&/, '&category=' + current_cat + '&' ) );
					}

					$( this ).addClass( 'active' );
					self.load_posts( current_cat, infinite_load || load_more ? true : false, $parent, post_type, $posts_wrap, undefined, $( this ).children( 'a' ).attr( 'href' ) );
				} else if ( 'faq' == post_type ) {
					$parent.find( '.faq' ).each( function() {
						var $that = $( this ), easing = "easeInOutQuart", timeout = 300;
						if ( selector == '*' ) {
							if ( $that.css( 'display' ) == 'none' ) $that.stop( true ).slideDown( timeout, easing, function() {
								$( this ).attr( 'style', '' ).show();
							} );
							selected++;
						} else {
							if ( $that.hasClass( selector ) ) {
								if ( $that.css( 'display' ) == 'none' ) $that.stop( true ).slideDown( timeout, easing, function() {
									$( this ).attr( 'style', '' ).show();
								} );
								selected++;
							} else {
								if ( $that.css( 'display' ) != 'none' ) $that.stop( true ).slideUp( timeout, easing, function() {
									$( this ).attr( 'style', '' ).hide();
								} );
							}
						}
					} );

					if ( !selected && $parent.find( '.faqs-infinite' ).length && typeof ( $.fn.infinitescroll ) != 'undefined' ) {
						$parent.find( '.faqs-infinite' ).infinitescroll( 'retrieve' );
					}
				} else if ( $parent.hasClass( 'portfolios-timeline' ) ) {
					var selected = 0;
					$parent.find( '.portfolio' ).each( function() {
						var $that = $( this ), easing = "easeInOutQuart", timeout = 300;
						if ( selector == '*' ) {
							if ( $that.css( 'display' ) == 'none' ) $that.stop( true ).slideDown( timeout, easing, function() {
								$( this ).attr( 'style', '' ).show();
							} );
							selected++;
						} else {
							if ( $that.hasClass( selector ) ) {
								if ( $that.css( 'display' ) == 'none' ) $that.stop( true ).slideDown( timeout, easing, function() {
									$( this ).attr( 'style', '' ).show();
								} );
								selected++;
							} else {
								if ( $that.css( 'display' ) != 'none' ) $that.stop( true ).slideUp( timeout, easing, function() {
									$( this ).attr( 'style', '' ).hide();
								} );
							}
						}
					} );
					if ( !selected && $parent.find( '.portfolios-infinite' ).length && typeof ( $.fn.infinitescroll ) != 'undefined' ) {
						$parent.find( '.portfolios-infinite' ).infinitescroll( 'retrieve' );
					}
					setTimeout( function() {
						theme.FilterZoom.initialize( $parent );
					}, 400 );
				} else {
					$parent.find( '.' + post_type + '-row' ).isotope( {
						filter: selector == '*' ? selector : '.' + selector
					} );
				}

				if ( !use_ajax ) {
					$( this ).addClass( 'active' );
					self.isLoading = false;
				}

				if ( position == 'sidebar' ) {
					self.$elements.each( function() {
						var $that = $( this );

						if ( $that == $this && $that.data( 'position' ) != 'sidebar' ) return;
						$that.find( 'li' ).removeClass( 'active' );
						$that.find( 'li[data-filter="' + selector + '"]' ).addClass( 'active' );
					} );
				}

				if ( !use_ajax ) {
					window.location.hash = '#' + selector;
				}
				theme.refreshVCContent();
				return false;
			},

			build: function( post_type_param ) {
				var self = this;

				self.$elements.each( function() {
					var $this = $( this ),
						position = $this.data( 'position' ),
						$parent,
						post_type;
					if ( typeof post_type_param == 'undefined' ) {
						if ( $this.hasClass( 'member-filter' ) ) {
							post_type = 'member';
						} else if ( $this.hasClass( 'faq-filter' ) ) {
							post_type = 'faq';
						} else if ( $this.hasClass( 'product-filter' ) ) {
							post_type = 'product';
						} else if ( $this.hasClass( 'post-filter' ) ) {
							post_type = 'post';
						} else if ( $this.hasClass( 'portfolio-filter' ) ) {
							post_type = 'portfolio';
						} else {
							post_type = $this.attr( 'data-filter-type' );
						}
					} else {
						post_type = post_type_param;
					}

					if ( 'sidebar' == position ) {
						$parent = $( '.main-content .page-' + post_type + 's' );
						//theme.scrolltoContainer($parent);
					} else if ( 'global' == position ) {
						$parent = $( '.main-content .page-' + post_type + 's' );
					} else {
						$parent = $this.closest( '.page-' + post_type + 's' );
					}
					if ( !$parent.length ) {
						$parent = $this.closest( '.porto-posts-grid' );
					}
					if ( !$parent || !$parent.length ) {
						return;
					}
					var use_ajax = $this.hasClass( 'porto-ajax-filter' ),
						infinite_load = $parent.hasClass( 'load-infinite' ),
						load_more = $parent.hasClass( 'load-more' );

					var $posts_wrap = $parent.find( '.' + post_type + 's-container' ),
						page_path;
					if ( use_ajax && ( ( !infinite_load && !load_more ) || !$parent.data( 'ajax_load_options' ) ) ) {
						var current_url = window.location.href;
						if ( -1 !== current_url.indexOf( '#' ) ) {
							current_url = current_url.split( '#' )[0];
						}
						page_path = theme.ajax_url + '?action=porto_ajax_posts&nonce=' + js_porto_vars.porto_nonce + '&post_type=' + post_type + '&current_link=' + current_url + '&category=&page=%cur_page%';
						if ( $parent.data( 'post_layout' ) ) {
							page_path += '&post_layout=' + $parent.data( 'post_layout' );
						}
						$posts_wrap.data( 'page_path', page_path );
					}

					$this.find( 'li' ).on( 'click', { thisobj: $this, selfobj: self, elements: self.$elements, position: position, parent: $parent, post_type: post_type, posts_wrap: $posts_wrap, use_ajax: use_ajax, page_path: page_path, infinite_load: infinite_load, load_more: load_more }, self.filterFn );
				} );

				$( window ).on( 'hashchange', { elements: self.$elements }, self.hashchange );
				self.hashchange( { data: { elements: self.$elements } } );

				return self;
			},

			hashchange: function( e ) {
				if ( typeof e == 'undefined' || typeof e.data == 'undefined' || typeof e.data.elements == 'undefined' || !e.data.elements || !e.data.elements.length ) {
					return;
				}
				var $elements = e.data.elements,
					$filter = $( $elements.get( 0 ) ),
					hash = window.location.hash;

				if ( hash ) {
					var $o = $filter.find( 'li[data-filter="' + hash.replace( '#', '' ) + '"]' );
					if ( !$o.hasClass( 'active' ) ) {
						$o.trigger( 'click' );
					}
				}
			},

			set_elements: function( $elements ) {
				var self = this;
				if ( typeof $elements == 'undefined' || !$elements || !$elements.length ) {
					self.destroy( self.$elements );
					return;
				}
				self.$elements = $elements;
				$( window ).off( 'hashchange', self.hashchange ).on( 'hashchange', { elements: $elements }, self.hashchange );
			},

			destroy: function( $elements ) {
				if ( typeof $elements == 'undefined' || !$elements || !$elements.length ) {
					return;
				}
				var self = this;
				$elements.find( 'li' ).off( 'click', self.filterFn );
				$( window ).off( 'hashchange', self.hashchange );
			},

			load_posts: function( cat, is_infinite, $parent, post_type, $posts_wrap, default_args, page_url ) {
				var pid = $parent.attr( 'id' ),
					self = this,
					is_archive = $parent.hasClass( 'archive-posts' ),
					successfn = function( res, directcall ) {
						if ( !res ) {
							return;
						}
						if ( ( typeof directcall == 'undefined' || true !== directcall ) && typeof default_args == 'undefined' && pid ) {
							if ( !self.cache[pid] ) {
								self.cache[pid] = {};
							}
							self.cache[pid][cat] = res;
						}
						var $res = $( res ),
							is_shop = $parent.hasClass( 'archive-products' ),
							$posts = $res.find( is_archive ? '.archive-posts .posts-wrap' : '.posts-wrap' ).children();

						if ( !$posts.length ) {
							return;
						}

						if ( typeof $posts_wrap == 'undefined' || is_archive ) {
							$posts_wrap = $parent.find( '.' + post_type + 's-container' );
						}
						if ( !$posts_wrap.length ) {
							return;
						}

						if ( $posts_wrap.data( 'isotope' ) ) {
							$posts_wrap.isotope( 'remove', $posts_wrap.children() );
						} else {
							$posts_wrap.children().remove();
						}

						if ( $posts_wrap.hasClass( 'owl-loaded' ) ) {
							$posts_wrap.removeClass( 'owl-loaded' );
						}
						$posts.children().addClass( 'fadeInUp animated' );
						$posts_wrap.append( $posts );
						theme.refreshVCContent( $posts );

						// filter
						var $old_filter = $parent.find( '.' + post_type + '-filter' );
						if ( $old_filter.length && !$old_filter.hasClass( 'porto-ajax-filter' ) && !$parent.hasClass( 'load-infinite' ) && !$parent.hasClass( 'load-more' ) ) {
							var $new_filter = $res.find( ( is_archive ? '.archive-posts ' : '' ) + '.' + post_type + '-filter' );
							if ( $new_filter.length ) {
								$old_filter.find( 'li:first-child' ).trigger( 'click' );
								theme.PostFilter.destroy( $old_filter );
								$old_filter.replaceWith( $new_filter );
								//$new_filter = $parent.find( '.' + post_type + '-filter' );
								theme.PostFilter.initialize( $new_filter, post_type );
								theme.PostFilter.set_elements( $( 'ul[data-filter-type], ul.portfolio-filter, ul.member-filter, ul.faq-filter, .porto-ajax-filter.product-filter, .porto-ajax-filter.post-filter' ) );
							}
						}

						porto_init( $parent );

						var behavior_action = '';
						if ( post_type != 'product' && post_type != 'member' && post_type != 'faq' && post_type != 'portfolio' && post_type != 'post' ) {
							behavior_action = 'ptu';
						} else {
							behavior_action = post_type;
						}
						theme.PostsInfinite[behavior_action + 'Behavior']( $posts, $posts_wrap );

						// init CountDown
						$( document.body ).trigger( 'porto_init_countdown', [$posts_wrap] );

						// pagination
						var $old_pagination = $parent.find( '.pagination-wrap' ),
							$new_pagination = $res.find( ( is_archive ? '.archive-posts ' : '' ) + '.pagination-wrap' ).eq( 0 ),
							has_pagination = false;
						if ( $old_pagination.length ) {
							if ( $new_pagination.length ) {
								$old_pagination.replaceWith( $new_pagination );
								has_pagination = true;
							} else {
								$old_pagination.children().remove();
							}
						} else if ( $new_pagination.length ) {
							$parent.append( $new_pagination );
							has_pagination = true;
						}

						if ( is_infinite ) {
							var infinitescroll_ins = $posts_wrap.data( 'infinitescroll' );
							if ( has_pagination ) {
								var $new_posts_wrap = $res.find( is_archive ? '.archive-posts .posts-wrap' : '.posts-wrap' );
								if ( $new_posts_wrap.data( 'cur_page' ) ) {
									$posts_wrap.data( 'cur_page', $new_posts_wrap.data( 'cur_page' ) );
									$posts_wrap.data( 'max_page', $new_posts_wrap.data( 'max_page' ) );
								}

								var should_init_again = true;
								if ( infinitescroll_ins ) {
									if ( infinitescroll_ins.options.state.isDestroyed ) {
										$posts_wrap.removeData( 'infinitescroll' );
									} else {
										should_init_again = false;
										if ( $new_posts_wrap.data( 'cur_page' ) ) {
											infinitescroll_ins.update( {
												maxPage: $new_posts_wrap.data( 'max_page' ),
												state: {
													currPage: $new_posts_wrap.data( 'cur_page' )
												}
											} );
										}
										if ( infinitescroll_ins.options.state.isPaused ) {
											infinitescroll_ins.resume();
										}
									}
								}

								if ( should_init_again ) {
									var ins = $posts_wrap.data( '__postsinfinite' );
									if ( ins ) {
										ins.destroy();
									}
									new theme.PostsInfinite( $posts_wrap, '.' + post_type + ', .timeline-date', $posts_wrap.data( 'infiniteoptions' ), post_type );
								}

								if ( is_archive ) {
									var page_path = $posts_wrap.siblings( '.pagination-wrap' ).find( '.next' ).attr( 'href' );
									if ( page_path ) {
										page_path += ( -1 !== page_path.indexOf( '?' ) ? '&' : '?' ) + 'portoajax=1&load_posts_only=2';
										page_path = page_path.replace( /(paged=)(\d+)|(page\/)(\d+)/, '$1$3%cur_page%' );
										$posts_wrap.data( 'page_path', page_path );
									}
								}

								new theme.PostsInfinite( $posts_wrap, '.' + post_type + ', .timeline-date', $posts_wrap.data( 'infiniteoptions' ), post_type );
							}
						}

						// in archive page
						if ( is_archive ) {
							// update widgets
							$( '.sidebar-content' ).each( function( index ) {
								var $this = $( this ),
									$that = $( $res.find( '.sidebar-content' ).get( index ) );

								$this.html( $that.html() );

								// in shop
								if ( is_shop ) {
									if ( typeof updateSelect2 != 'undefined' && updateSelect2 ) {
										// Use Select2 enhancement if possible
										if ( jQuery().selectWoo ) {
											var porto_wc_layered_nav_select = function() {
												$this.find( 'select.woocommerce-widget-layered-nav-dropdown' ).each( function() {
													$( this ).selectWoo( {
														placeholder: $( this ).find( 'option' ).eq( 0 ).text(),
														minimumResultsForSearch: 5,
														width: '100%',
														allowClear: typeof $( this ).attr( 'multiple' ) != 'undefined' && $( this ).attr( 'multiple' ) == 'multiple' ? 'false' : 'true'
													} );
												} );
											};
											porto_wc_layered_nav_select();
										}
										$( 'body' ).children( 'span.select2-container' ).remove();
									}
								}
							} );

							// in shop
							if ( is_shop ) {
								var $script = $res.filter( 'script:contains("var woocommerce_price_slider_params")' ).first();
								if ( $script && $script.length && $script.text().indexOf( '{' ) !== -1 && $script.text().indexOf( '}' ) !== -1 ) {
									var arrStr = $script.text().substring( $script.text().indexOf( '{' ), $script.text().indexOf( '}' ) + 1 );
									window.woocommerce_price_slider_params = JSON.parse( arrStr );
								}

								// update entry title
								var $title = $( '.entry-title' );
								if ( $title.length ) {
									var $newTitle = $res.find( '.entry-title' ).eq( 0 );
									if ( $newTitle.length ) {
										$title.html( $newTitle.html() );
									}
								}

								// update entry description
								var $desc = $( '.entry-description' );
								if ( $desc.length ) {
									var $newDesc = $res.find( '.entry-description' ).eq( 0 );
									if ( $newDesc.length ) {
										$desc.html( $newDesc.html() );
									}
								}

								// top toolbar
								var shop_before = '.shop-loop-before',
									$shop_before = $( shop_before );
								if ( $shop_before.length ) {
									if ( $res.find( shop_before ).length ) {
										$shop_before.each( function( index ) {
											var $res_shop_before = $res.find( shop_before ).eq( index );
											if ( $res_shop_before.length ) {
												$( this ).html( $res_shop_before.html() ).show();
											}
										} );
									} else {
										$shop_before.empty();
									}
								}

								// update result count
								var $count = $( '.woocommerce-result-count' );
								if ( $count.length ) {
									var $newCount = $res.find( '.woocommerce-result-count' ).eq( 0 );
									if ( $newCount.length ) {
										$count[0].outerHTML = $newCount.length ? $newCount[0].outerHTML : '';
									}
								}

								// trigger ready event
								$( document ).trigger( 'yith-wcan-ajax-filtered' );
							}

							// update browser history (IE doesn't support it)
							if ( page_url && !navigator.userAgent.match( /msie/i ) ) {
								window.history.pushState( { 'pageTitle': ( res && res.pageTitle ) || '' }, '', page_url );
							}
						}

						$( document.body ).trigger( 'porto_load_posts_end', [$parent.parent()] );
					};

				if ( typeof default_args == 'undefined' && typeof self.cache[pid] != 'undefined' && typeof self.cache[pid][cat] != 'undefined' && self.cache[pid][cat] ) {
					successfn( self.cache[pid][cat], true );
					self.isLoading = false;
					$parent.removeClass( 'porto-ajax-loading' ).removeClass( 'loading' ).find( '.porto-loading-icon' ).remove();
					return;
				}

				var ajax_load_options = $parent.data( 'ajax_load_options' );
				if ( ( $parent.hasClass( 'archive-products' ) && -1 != js_porto_vars.use_skeleton_screen.indexOf( 'shop' ) ) ||
					( is_archive && -1 != js_porto_vars.use_skeleton_screen.indexOf( 'blog' ) ) ) { // skeleton screen in archive builder
					$posts_wrap = $parent.find( '.' + post_type + 's-container' );
					if ( ajax_load_options ) {
						var tag_name = 'div';
						if ( 'product' == post_type && 'ul' == $posts_wrap.get( 0 ).tagName.toLowerCase() ) {
							tag_name = 'li';
						}
						$posts_wrap.addClass( 'skeleton-body' ).empty();
						for ( var i = 0; i < Number( ajax_load_options.count || ( ajax_load_options.columns && ajax_load_options.columns * 3 ) || 12 ); i++ ) {
							$posts_wrap.append( '<' + tag_name + ' class="porto-tb-item post ' + post_type + ( 'product' == post_type ? ' product-col' : '' ) + '"></' + tag_name + '>' );
						}
					} else {
						$posts_wrap.addClass( 'skeleton-body' ).children().empty();
					}
				} else {
					if ( !$parent.children( '.porto-loading-icon' ).length ) {
						$parent.append( '<i class="porto-loading-icon"></i>' );
					}
					$parent.addClass( 'porto-ajax-loading' );
				}

				var current_url = window.location.href;
				if ( -1 !== current_url.indexOf( '#' ) ) {
					current_url = current_url.split( '#' )[0];
				}

				var args, load_url = theme.ajax_url;
				if ( $parent.hasClass( 'archive-posts' ) ) { // archive builder
					args = {
						portoajax: true,
						load_posts_only: true
					};
					if ( $parent.closest( '.porto-block' ).length ) {
						args['builder_id'] = $parent.closest( '.porto-block' ).data( 'id' );
					}
					load_url = typeof page_url != 'undefined' ? page_url : current_url;
				} else {
					args = {
						action: 'porto_ajax_posts',
						nonce: js_porto_vars.porto_nonce,
						post_type: post_type,
						current_link: current_url
					};
					if ( $parent.data( 'post_layout' ) ) {
						args['post_layout'] = $parent.data( 'post_layout' );
					}
					if ( ajax_load_options ) {
						args['extra'] = ajax_load_options;
					}
					if ( typeof default_args != 'undefined' ) {
						args = $.extend( args, default_args );
					}
				}
				if ( cat ) {
					args['category'] = cat;
				}

				$.ajax( {
					url: load_url,
					type: 'post',
					data: args,
					success: successfn,
					complete: function() {
						self.isLoading = false;
						$posts_wrap.removeClass( 'skeleton-body' );
						$parent.removeClass( 'porto-ajax-loading' ).removeClass( 'loading' ).find( '.porto-loading-icon' ).remove();
					}
				} );

			}
		}

	} );

} ).apply( this, [window.theme, jQuery] );

// Filter Zoom
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	$.extend( theme, {

		FilterZoom: {

			defaults: {
				elements: null
			},

			initialize: function( $elements ) {
				this.$elements = ( $elements || this.defaults.elements );

				this.build();

				return this;
			},

			build: function() {
				var self = this;

				self.$elements.each( function() {
					var $this = $( this ),
						zoom = $this.find( '.zoom, .thumb-info-zoom' ).get( 0 );

					if ( !zoom ) return;

					$this.find( '.zoom, .thumb-info-zoom' ).off( 'click' );
					var links = [];
					var i = 0;
					$this.find( 'article' ).each( function() {
						var $that = $( this );
						if ( $that.css( 'display' ) != 'none' ) {
							var $zoom = $that.find( '.zoom, .thumb-info-zoom' ),
								slide,
								src = $zoom.data( 'src' ),
								title = $zoom.data( 'title' );

							$zoom.data( 'index', i );
							if ( Array.isArray( src ) ) {
								$.each( src, function( index, value ) {
									slide = {};
									slide.src = value;
									slide.title = title[index];
									links[i] = slide;
									i++;
								} );
							} else {
								slide = {};
								slide.src = src;
								slide.title = title;
								links[i] = slide;
								i++;
							}
						}
					} );
					$this.find( 'article' ).each( function() {
						var $that = $( this );
						if ( $that.css( 'display' ) != 'none' ) {
							$that.off( 'click', '.zoom, .thumb-info-zoom' ).on( 'click', '.zoom, .thumb-info-zoom', function( e ) {
								var $zoom = $( this ), $parent = $zoom.parents( '.thumb-info' ), offset = 0;
								if ( $parent.get( 0 ) ) {
									var $slider = $parent.find( '.porto-carousel' );
									if ( $slider.get( 0 ) ) {
										offset = $slider.data( 'owl.carousel' ).current() - $slider.find( '.cloned' ).length / 2;
									}
								}
								e.preventDefault();
								if ( $.fn.magnificPopup ) {
									$.magnificPopup.close();
									$.magnificPopup.open( $.extend( true, {}, theme.mfpConfig, {
										items: links,
										gallery: {
											enabled: true
										},
										type: 'image'
									} ), $zoom.data( 'index' ) + offset );
								}
								return false;
							} );
						}
					} );
				} );

				return self;
			}
		}

	} );

} ).apply( this, [window.theme, jQuery] );

// Mouse Parallax
( function( theme, $ ) {
	'use strict';

	theme = theme || {};

	var instanceName = '__parallax';

	var Mouseparallax = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	Mouseparallax.prototype = {
		initialize: function( $el, opts ) {
			this.$el = $el;

			this
				.setData()
				.setOptions( opts )
				.build();

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, this );
			return this;
		},

		setOptions: function( opts ) {
			this.options = $.extend( true, {}, {
				wrapper: this.$el,
				opts: opts
			} );
			return this;
		},

		build: function() {
			if ( !$.fn.parallax ) {
				return this;
			}

			var $el = this.options.wrapper,
				opts = this.options.opts

			$el.parallax( opts );
		}
	};

	//expose to scope
	$.extend( theme, {
		Mouseparallax: Mouseparallax
	} );

	// jquery plugin
	$.fn.themeMouseparallax = function( opts ) {
		var obj = this.map( function() {
			var $this = $( this );

			if ( $this.data( instanceName ) ) {
				return $this.data( instanceName );
			} else {
				return new theme.Mouseparallax( $this, opts );
			}
		} );
		return obj;
	}
} ).apply( this, [window.theme, jQuery] );

// Read More
( function( theme, $ ) {

	theme = theme || {};

	var instanceName = '__readmore';

	var PluginReadMore = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	PluginReadMore.defaults = {
		buttonOpenLabel: 'Read More <i class="fas fa-chevron-down text-2 ms-1"></i>',
		buttonCloseLabel: 'Read Less <i class="fas fa-chevron-up text-2 ms-1"></i>',
		enableToggle: true,
		maxHeight: 300,
		overlayColor: '#43a6a3',
		overlayHeight: 100,
		startOpened: false,
		align: 'left'
	};

	PluginReadMore.prototype = {
		initialize: function( $el, opts ) {
			var self = this;

			this.$el = $el;

			this
				.setData()
				.setOptions( opts )
				.build()
				.events()
				.resize();

			if ( self.options.startOpened ) {
				self.options.wrapper.find( '.readmore-button-wrapper > button' ).trigger( 'click' );
			}

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, this );

			return this;
		},

		setOptions: function( opts ) {
			this.options = $.extend( true, {}, PluginReadMore.defaults, opts, {
				wrapper: this.$el
			} );

			return this;
		},

		build: function() {
			var self = this;

			self.options.wrapper.addClass( 'position-relative' );

			// Overlay
			self.options.wrapper.append( '<div class="readmore-overlay"></div>' );

			// Check if is Safari
			var backgroundCssValue = 'linear-gradient(180deg, rgba(2, 0, 36, 0) 0%, ' + self.options.overlayColor + ' 100%)';
			if ( $( 'html' ).hasClass( 'safari' ) ) {
				backgroundCssValue = '-webkit-linear-gradient(top, rgba(2, 0, 36, 0) 0%, ' + self.options.overlayColor + ' 100%)'
			}

			self.options.wrapper.find( '.readmore-overlay' ).css( {
				background: backgroundCssValue,
				position: 'absolute',
				bottom: 0,
				left: 0,
				width: '100%',
				height: self.options.overlayHeight,
				'z-index': 1
			} );

			// Read More Button
			self.options.wrapper.find( '.readmore-button-wrapper' ).removeClass( 'd-none' ).css( {
				position: 'absolute',
				bottom: 0,
				left: 0,
				width: '100%',
				'z-index': 2
			} );

			// Button Label
			self.options.wrapper.find( '.readmore-button-wrapper > button' ).html( self.options.buttonOpenLabel );

			self.options.wrapper.css( {
				'height': self.options.maxHeight,
				'overflow-y': 'hidden'
			} );

			// Alignment
			switch ( self.options.align ) {
				case 'center':
					self.options.wrapper.find( '.readmore-button-wrapper' ).addClass( 'text-center' );
					break;

				case 'right':
					self.options.wrapper.find( '.readmore-button-wrapper' ).addClass( 'text-end' );
					break;

				case 'left':
				default:
					self.options.wrapper.find( '.readmore-button-wrapper' ).addClass( 'text-start' );
					break;
			}

			return this;

		},

		events: function() {
			var self = this;

			// Read More
			self.readMore = function() {
				self.options.wrapper.find( '.readmore-button-wrapper > button:not(.readless)' ).on( 'click', function( e ) {
					e.preventDefault();
					self.options.wrapper.addClass( 'opened' );

					var $this = $( this );

					setTimeout( function() {
						self.options.wrapper.animate( {
							'height': self.options.wrapper[0].scrollHeight
						}, function() {
							if ( !self.options.enableToggle ) {
								$this.fadeOut();
							}

							$this.html( self.options.buttonCloseLabel ).addClass( 'readless' ).off( 'click' );

							self.readLess();

							self.options.wrapper.find( '.readmore-overlay' ).fadeOut();
							self.options.wrapper.css( {
								'max-height': 'none',
								'overflow': 'visible'
							} );

							self.options.wrapper.find( '.readmore-button-wrapper' ).animate( {
								bottom: -20
							} );
						} );
					}, 200 );
				} );
			}

			// Read Less
			self.readLess = function() {
				self.options.wrapper.find( '.readmore-button-wrapper > button.readless' ).on( 'click', function( e ) {
					e.preventDefault();
					self.options.wrapper.removeClass( 'opened' );

					var $this = $( this );

					// Button
					self.options.wrapper.find( '.readmore-button-wrapper' ).animate( {
						bottom: 0
					} );

					// Overlay
					self.options.wrapper.find( '.readmore-overlay' ).fadeIn();

					setTimeout( function() {
						self.options.wrapper.height( self.options.wrapper[0].scrollHeight ).animate( {
							'height': self.options.maxHeight
						}, function() {
							$this.html( self.options.buttonOpenLabel ).removeClass( 'readless' ).off( 'click' );

							self.readMore();

							self.options.wrapper.css( {
								'overflow': 'hidden'
							} );
						} );
					}, 200 );
				} );
			}

			// First Load
			self.readMore();

			return this;
		},

		resize: function() {
			var self = this;
			window.addEventListener( 'resize', function() {
				self.options.wrapper.hasClass( 'opened' ) ? self.options.wrapper.css( { 'height': 'auto' } ) : self.options.wrapper.css( { 'height': self.options.maxHeight } );
			} )
		}
	};

	// expose to scope
	$.extend( theme, {
		PluginReadMore: PluginReadMore
	} );

	// jquery plugin
	$.fn.themePluginReadMore = function( opts ) {
		return this.map( function() {
			var $this = $( this );

			if ( $this.data( instanceName ) ) {
				return $this.data( instanceName );
			} else {
				return new PluginReadMore( $this, $this.data( 'plugin-options' ) );
			}

		} );
	}

} ).apply( this, [window.theme, jQuery] );

// Mouse Hover Split
( function( theme, $ ) {

	theme = theme || {};

	var instanceName = '__mousehoversplit';

	var PluginHoverSplit = function( $el ) {
		return this.initialize( $el );
	}

	PluginHoverSplit.prototype = {
		initialize: function( $el ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}
			this.$el = $el.addClass( 'slide-wrapper' );

			this
				.setData()
				.event();

			return this;
		},

		setData: function() {
			this.$el.data( instanceName, this );
			this.$el.addClass( 'initialized' );
			var $columns = this.$el.find( '>.split-slide' );
			for ( var index = 0; index < $columns.length; index++ ) {
				var column = $columns[index];
				if ( index == 0 ) {
					column.classList.add( 'slide-left' );
					this.left = column;
				} else if ( index == 1 ) {
					column.classList.add( 'slide-right' );
					break;
				}
			}

			return this;
		},

		event: function() {
			// Refresh
			this.refresh();
			this.refreshFunc = this.refresh.bind( this );
			$( window ).on( 'resize', this.refreshFunc );

			//Hover
			this.handleMoveFunc = this.handleMove.bind( this );
			$( document.body ).on( 'mousemove', this.handleMoveFunc );
		},
		handleMove: function( e ) {
			if ( e.clientX < this.$el.offset().left ) {
				this.left.style.width = '0';
			} else {
				this.left.style.width = `calc( ${ ( e.clientX - this.$el.offset().left ) / ( this.$el.innerWidth() ) * 100 }% - 3px ) `;
			}
		},
		refresh: function( e ) {
			if ( e && e.type == 'resize' ) {
				this.$el.css( 'min-height', $( this.left ).height() );
			}
			this.$el.find( '>.split-slide>*' ).css( 'width', this.$el.innerWidth() );
		},
		clearData: function() {
			// Remove class and instance
			this.$el.removeClass( 'slide-wrapper' ).removeData( instanceName ).css( 'min-height', '' );
			this.$el.find( '>*' ).removeClass( 'slide-left slide-right' ).css( 'width', '' );

			// Clear Event
			$( window ).off( 'resize', this.refreshFunc );
			$( document.body ).off( 'mousemove', this.handleMoveFunc );
		}
	}

	// expose to scope
	$.extend( theme, {
		PluginHoverSplit: PluginHoverSplit
	} );

	$.fn.themePluginHoverSplit = function() {
		return this.map( function() {
			var $this = $( this ),
				$splitColumns = $this.find( '>.split-slide' );
			if ( $splitColumns.length >= 2 ) {
				if ( $this.data( instanceName ) ) {
					return $this.data( instanceName );
				} else {
					return new PluginHoverSplit( $this );
				}
			}
		} );
	}
} ).apply( this, [window.theme, jQuery] );

// Horizontal Scroller
( function( theme, $ ) {
	theme = theme || {};

	var instanceName = '__horizontalscroller';

	var PluginHScroller = function( $el, opts ) {
		return this.initialize( $el, opts );
	}

	PluginHScroller.defaults = {
		lg: 3,
		md: 1,
		init_refresh: false,
	};

	PluginHScroller.prototype = {
		initialize: function( $el, opts ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}
			this.$el = $el;

			this
				.setData( opts )
				.build()
				.event();

			return this;
		},
		setData: function( opts ) {
			this.$el.data( instanceName, this );
			this.options = $.extend( true, {}, PluginHScroller.defaults, opts );
			this.$hScroller = this.$el.find( '.horizontal-scroller' );
			this.$hScrollerItems = this.$hScroller.find( '.horizontal-scroller-items' );
			this.$hScrollerItems.find( '>*' ).addClass( 'horizontal-scroller-item' );
			return this;
		},
		build: function() {
			// Copy Original HTML to clone on Resize.
			this.originalScrollHTML = this.$hScroller.html();
			this.scrollerInitialized = false;

			return this;
		},
		// Generate Scroller
		generateScroller: function() {
			var items = gsap.utils.toArray( this.$hScrollerItems.find( '.horizontal-scroller-item' ) );
			gsap.to( items, {
				xPercent: -100 * ( items.length - ( $( window ).width() > 991 ? this.options.lg : this.options.md ) ),
				ease: 'none',
				scrollTrigger: {
					trigger: '.horizontal-scroller',
					pin: true,
					scrub: 1,
					snap: 1 / ( items.length - 1 ),
					end: () => '+=' + this.$hScrollerItems.width(),
					el: this.$el,
				}
			} );

			this.scrollerInitialized = true;
		},
		event: function() {
			if ( this.options.init_refresh ) {
				this.generateScroller();
			}
			// Scroll Event to initialize when visible
			this.scrollFunc = this.scroll.bind( this );
			$( window ).on( 'scroll', this.scrollFunc );

			// Resize Event removing and restarting
			this.afterResizeFunc = this.afterResize.bind( this );
			$( window ).on( 'afterResize', this.afterResizeFunc );
		},
		scroll: function() {
			if ( !this.scrollerInitialized ) {

				var position = this.$el[0].getBoundingClientRect();

				if ( position.top >= 0 && position.top < window.innerHeight && position.bottom >= 0 ) {
					this.generateScroller();
				}
			}
		},
		afterResize: function() {

			this.scrollerInitialized = false;
			var Alltrigger = ScrollTrigger.getAll();

			for ( var i = 0; i < Alltrigger.length; i++ ) {
				if ( Alltrigger[i]['vars'] && typeof Alltrigger[i]['vars']['el'] != 'undefined' && Alltrigger[i]['vars']['el'] == this.$el ) {
					Alltrigger[i].kill( true );
					this.$el.empty().html( '<div class="horizontal-scroller">' + this.originalScrollHTML + '</div>' );
					this.$hScrollerItems = this.$el.find( '.horizontal-scroller-items' );
					break;
				}
			}
		},
		clearData: function() {
			this.$el.removeData( instanceName );
			$( window ).off( 'scroll', this.scrollFunc );
			$( window ).off( 'afterResize', this.afterResizeFunc );
		}
	};
	// expose to scope
	$.extend( theme, {
		PluginHScroller: PluginHScroller
	} );
	$.fn.themePluginHScroller = function( opt = false ) {
		if ( typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' ) {
			return this.map( function() {
				var $this = $( this );
				if ( $this.data( instanceName ) ) {
					return $this.data( instanceName );
				} else {
					if ( $this.find( '.horizontal-scroller-items>*' ).length ) {
						options = $this.data( 'plugin-hscroll' );
						if ( opt ) {
							options['init_refresh'] = true;
						}
						return new PluginHScroller( $this, options );
					}
				}
			} );
		} else {
			return false;
		}
	}
} ).apply( this, [window.theme, jQuery] );

// Text Hover Image Floating - Ultimate Heading, Custom Heading for wpb
( function( theme, $ ) {
	theme = theme || {};

	var instanceName = '__textelfloating';

	var PluginTElFloaing = function( $el, opts ) {
		return this.initialize( $el, opts );
	};

	PluginTElFloaing.defaults = {
		offset: 0,
	};

	PluginTElFloaing.prototype = {
		initialize: function( $el, opts ) {
			if ( $el.data( instanceName ) ) {
				return this;
			}
			this.$el = $el;

			this
				.setData( opts )
				.event();

			return this;
		},
		setData: function( opts ) {
			this.options = $.extend( true, {}, PluginTElFloaing.defaults, opts );
			this.$el.data( instanceName, this );
			return this;
		},
		event: function() {
			this.mouseEnterFunc = this.mouseEnter.bind( this );
			this.$el.on( 'mouseenter', this.mouseEnterFunc );
			this.mouseOutFunc = this.mouseOut.bind( this );
			this.$el.on( 'mouseleave', this.mouseOutFunc );
		},
		mouseEnter: function( e ) {

			$( '.thumb-info-floating-element-clone' ).remove();
			var $thumbFloatingEl = $( '.thumb-info-floating-element', this.$el );
			if ( $thumbFloatingEl.length ) {
				this.$elClone = $thumbFloatingEl.clone().addClass( 'thumb-info-floating-element-clone' ).removeClass( 'd-none' ).appendTo( document.body );
			} else if ( this.$el.hasClass( 'tb-hover-content' ) && this.$el.children().length > 0 ) {
				if ( this.$el.hasClass( 'with-link' ) ) {
					$thumbFloatingEl = this.$el.children( ':nth-child(2)' );
				} else {
					$thumbFloatingEl = this.$el.children( ':first' );
				}
				this.$elClone = $thumbFloatingEl.clone().addClass( 'thumb-tb-floating-el' ).appendTo( document.body ).wrap( '<div class="thumb-info-floating-element-clone page-wrapper"></div>' );
			} else {
				return;
			}

			// Image LazyLoad
			$imgs = $( '.thumb-info-floating-element-clone' ).find( 'img.porto-lazyload' );
			$imgs.each( function( index, img ) {
				var $img = $( img );
				if ( $img.length && $img.data( 'oi' ) ) {
					$img.attr( 'src', $img.data( 'oi' ) ).addClass( 'lazy-load-loaded' );
				}
			} );

			$( '.thumb-info-floating-element-clone' ).css( {
				left: e.clientX + parseInt( this.options.offset ),
				top: e.clientY + parseInt( this.options.offset )
			} ).fadeIn( 300 );

			gsap.to( '.thumb-info-floating-element-clone', 1, {
				css: {
					scaleX: 1,
					scaleY: 1
				}
			} );

			this.mouseMoveFunc = this.mouseMove.bind( this );
			$( document.body ).on( 'mousemove', this.mouseMoveFunc );
		},
		mouseMove: function( e ) {
			if ( this.$elClone.length && this.$elClone.closest( 'html' ).length ) {
				gsap.to( '.thumb-info-floating-element-clone', 0.5, {
					css: {
						left: e.clientX + parseInt( this.options.offset ),
						top: e.clientY + parseInt( this.options.offset )
					}
				} );
			}
		},
		mouseOut: function( e ) {
			if ( this.$elClone.length && this.$elClone.closest( 'html' ).length ) {
				gsap.to( '.thumb-info-floating-element-clone', 0.5, {
					css: {
						scaleX: 0.5,
						scaleY: 0.5,
						opacity: 0
					}
				} );
			}
		},
		clearData: function( e ) {
			this.$elClone.remove();
			this.$el.off( 'mouseenter', this.mouseEnterFunc );
			this.$el.off( 'mouseout', this.mouseOutFunc );
			$( document.body ).off( 'mousemove', this.mouseMoveFunc );
		}
	}

	$.extend( theme, {
		PluginTElFloaing: PluginTElFloaing
	} );
	$.fn.themePluginTIFloating = function() {
		if ( typeof gsap !== 'undefined' ) {
			return this.map( function() {
				var $this = $( this );
				if ( $this.data( instanceName ) ) {
					return $this.data( instanceName );
				} else {
					return new PluginTElFloaing( $this, $this.data( 'plugin-tfloating' ) );
				}
			} );
		} else {
			return false;
		}
	}
} ).apply( this, [window.theme, jQuery] );

/* initialize */
( function( theme, $ ) {
	theme.initAsync = function( $wrap, wrapObj ) {
		// Animate
		if ( $.fn.themeAnimate ) {

			$( function() {
				var svgAnimates = wrapObj.querySelectorAll( 'svg [data-appear-animation]' );
				if ( svgAnimates.length ) {
					$( svgAnimates ).closest( 'svg' ).attr( 'data-appear-animation-svg', '1' );
				}
				var $animates = wrapObj.querySelectorAll( '[data-plugin-animate], [data-appear-animation], [data-appear-animation-svg]' );
				if ( $animates.length ) {
					var animateResize = function() {
						if ( window.innerWidth < 768 ) {
							window.removeEventListener( 'resize', animateResize );
							$animates.forEach( function( o ) {
								o.classList.add( 'appear-animation-visible' );
							} );
						}
					};
					if ( theme.animation_support ) {
						window.addEventListener( 'resize', animateResize );
						theme.dynIntObsInit( $animates, 'themeAnimate', theme.Animate.defaults );
					} else {
						$animates.forEach( function( o ) {
							o.classList.add( 'appear-animation-visible' );
						} );
					}
				}
			} );
		}

		// Animated Letters
		if ( $.fn.themePluginAnimatedLetters ) {
			if ( $( '[data-plugin-animated-letters]' ).length || $( '.animated-letters' ).length ) {
				theme.intObs( '[data-plugin-animated-letters]:not(.manual), .animated-letters', 'themePluginAnimatedLetters' );
			}
			if ( $( '[data-plugin-animated-words]' ).length || $( '.animated-words' ).length ) {
				theme.intObs( '[data-plugin-animated-words]:not(.manual), .animated-words', 'themePluginAnimatedLetters' );
			}
		}

		// Carousel
		if ( $.fn.themeCarousel ) {

			$( function() {
				
				var portoImgNavMiddle = function ( $el ) {
					var $images = $el.find( '.owl-item img' ),
						height = 0;
						for ( var i = 0; i < $images.length; i++) {
							var imgHeight = $images.eq(i).height();
							if ( height < imgHeight ) {
								height = imgHeight;
							}
						}
					if ( $el.hasClass( 'products-slider' ) ) {
						$el.children( '.owl-nav' ).css( 'top', ( 5 + height / 2 ) + 'px' );
					} else {
						$el.children( '.owl-nav' ).css( 'top', height / 2 + 'px' );
					}
				};
				// Carousel Lazyload images
				var portoCarouselInit = function( e ) {
					var $this = $( e.currentTarget );

					$this.find( '[data-appear-animation]:not(.appear-animation)' ).addClass( 'appear-animation' );
					if ( $this.find( '.owl-item.cloned' ).length ) {
						$this.find( '.porto-lazyload:not(.lazy-load-loaded)' ).themePluginLazyLoad( { effect: 'fadeIn', effect_speed: 400 } );
						var $animates = e.currentTarget.querySelectorAll( '.appear-animation' );
						if ( $animates.length ) {
							if ( theme.animation_support ) {
							theme.dynIntObsInit( $animates, 'themeAnimate', theme.Animate.defaults );
							} else {
								$animates.forEach( function( o ) {
									o.classList.add( 'appear-animation-visible' );
								} );
							}
						}
						if ( $.fn.themePluginAnimatedLetters && ( $( this ).find( '.owl-item.cloned [data-plugin-animated-letters]:not(.manual)' ).length ) ) {
							theme.dynIntObsInit( $( this ).find( '.owl-item.cloned [data-plugin-animated-letters]:not(.manual)' ), 'themePluginAnimatedLetters' );
						}
					}

					setTimeout( function() {
						var $hiddenItems = $this.find( '.owl-item:not(.active)' );
						if ( theme.animation_support ) {
							$hiddenItems.find( '.appear-animation' ).removeClass( 'appear-animation-visible' );
							$hiddenItems.find( '.appear-animation' ).each( function() {
								var $el = $( this ),
									delay = Math.abs( $el.data( 'appear-animation-delay' ) ? $el.data( 'appear-animation-delay' ) : 0 );
								if ( delay > 1 ) {
									this.style.animationDelay = delay + 'ms';
								}

								var duration = Math.abs( $el.data( 'appear-animation-duration' ) ? $el.data( 'appear-animation-duration' ) : 1000 );
								if ( 1000 != duration ) {
									this.style.animationDuration = duration + 'ms';
								}
							} );
						}
						if ( window.innerWidth >= 1200 ) {
							$hiddenItems.find( '[data-vce-animate]' ).removeAttr( 'data-vcv-o-animated' );
						}
						// Position the navigation in the middle of the image
						if ( $this.hasClass( 'nav-center-images-only' ) ) {
							portoImgNavMiddle( $this );
						}
					}, 300 );
				};
				var portoCarouselTranslated = function( e ) {
					var $this = $( e.currentTarget );
					/*if ( window.innerWidth > 767 ) {
						if ( $this.find( '.owl-item.cloned' ).length && $this.find( '.appear-animation:not(.appear-animation-visible)' ).length ) {
							$( document.body ).trigger( 'appear_refresh' );
						}
					}*/

					var $active = $this.find( '.owl-item.active' );
					if ( $active.hasClass( 'translating' ) ) {
						$active.removeClass( 'translating' );
						return;
					}
					$this.find( '.owl-item.translating' ).removeClass( 'translating' );
					// Animated Letters
					$this.find( '[data-plugin-animated-letters]' ).removeClass( 'invisible' );
					$this.find( '.owl-item.active [data-plugin-animated-letters]' ).trigger( 'animated.letters.initialize' );

					if ( window.innerWidth > 767 ) {
						// WPBakery
						$this.find( '.appear-animation' ).removeClass( 'appear-animation-visible' );
						$active.find( '.appear-animation' ).each( function() {
							var $animation_item = $( this ),
								anim_name = $animation_item.data( 'appear-animation' );
							$animation_item.addClass( anim_name + ' appear-animation-visible' );
						} );
					}

					// sticky sidebar
					if ( window.innerWidth > 991 ) {
						if ( $this.closest( '[data-plugin-sticky]' ).length ) {
							theme.refreshStickySidebar( false, $this.closest( '[data-plugin-sticky]' ) );
						}
					}

					// Elementor
					$active.find( '.slide-animate' ).each( function() {
						var $animation_item = $( this ),
							settings = $animation_item.data( 'settings' );
						if ( settings && ( settings._animation || settings.animation ) ) {
							var animation = settings._animation || settings.animation,
								delay = settings._animation_delay || settings.animation_delay || 0;
							theme.requestTimeout( function() {
								$animation_item.removeClass( 'elementor-invisible' ).addClass( 'animated ' + animation );
							}, delay );
						}
					} );

					// Visual Composer
					if ( window.innerWidth >= 1200 ) {
						$this.find( '[data-vce-animate]' ).removeAttr( 'data-vcv-o-animated' ).removeAttr( 'data-vcv-o-animated-fully' );
						$active.find( '[data-vce-animate]' ).each( function() {
							var $animation_item = $( this );
							if ( $animation_item.data( 'porto-origin-anim' ) ) {
								var anim_name = $animation_item.data( 'porto-origin-anim' );
								$animation_item.attr( 'data-vce-animate', anim_name ).attr( 'data-vcv-o-animated', true );
								var duration = parseFloat( window.getComputedStyle( this )['animationDuration'] ) * 1000,
									delay = parseFloat( window.getComputedStyle( this )['animationDelay'] ) * 1000;
								window.setTimeout( function() {
									$animation_item.attr( 'data-vcv-o-animated-fully', true );
								}, delay + duration + 5 );
							}
						} );
					}
				};
				var portoCarouselTranslateVC = function( e ) {
					var $this = $( e.currentTarget );
					$this.find( '.owl-item.active' ).addClass( 'translating' );

					if ( window.innerWidth >= 1200 ) {
						$this.find( '[data-vce-animate]' ).each( function() {
							var $animation_item = $( this );
							$animation_item.data( 'porto-origin-anim', $animation_item.data( 'vce-animate' ) ).attr( 'data-vce-animate', '' );
						} );
					}
				};
				var portoCarouselTranslateElementor = function( e ) {
					var $this = $( e.currentTarget );
					$this.find( '.owl-item.active' ).addClass( 'translating' );
					$this.find( '.owl-item:not(.active) .slide-animate' ).addClass( 'elementor-invisible' );
					$this.find( '.slide-animate' ).each( function() {
						var $animation_item = $( this ),
							settings = $animation_item.data( 'settings' );
						if ( settings._animation || settings.animation ) {
							$animation_item.removeClass( settings._animation || settings.animation );
						}
					} );
				};
				var portoCarouselTranslateWPB = function( e ) {
					if ( window.innerWidth > 767 ) {
						var $this = $( e.currentTarget );
						$this.find( '.owl-item.active' ).addClass( 'translating' );
						$this.find( '.appear-animation' ).each( function() {
							var $animation_item = $( this );
							$animation_item.removeClass( $animation_item.data( 'appear-animation' ) );
						} );
					}
				};

				var carouselItems = $wrap.find( '.owl-carousel:not(.manual)' );
				carouselItems.on( 'initialized.owl.carousel refreshed.owl.carousel', portoCarouselInit ).on( 'translated.owl.carousel', portoCarouselTranslated );
				carouselItems.on( 'translate.owl.carousel', function() {
					// Hide elements inside carousel
					$( this ).find( '[data-plugin-animated-letters]' ).addClass( 'invisible' );
					// Animated Letters
					$( this ).find( '[data-plugin-animated-letters]' ).trigger( 'animated.letters.destroy' );
				} );
				carouselItems.on( 'resized.owl.carousel', function () {
					var $this = $( this );
					// Position the navigation in the middle of the image
					if ( $this.hasClass( 'nav-center-images-only' ) ) {
						portoImgNavMiddle( $this );
					}
				} )
				carouselItems.filter( function() {
					if ( $( this ).find( '[data-vce-animate]' ).length ) {
						return true;
					}
					return false;
				} ).on( 'translate.owl.carousel', portoCarouselTranslateVC );
				carouselItems.filter( function() {
					var $anim_obj = $( this ).find( '.elementor-invisible' );
					if ( $anim_obj.length ) {
						$anim_obj.addClass( 'slide-animate' );
						return true;
					}
					return false;
				} ).on( 'translate.owl.carousel', portoCarouselTranslateElementor );
				carouselItems.filter( function() {
					if ( $( this ).find( '.appear-animation, [data-appear-animation]' ).length ) {
						return true;
					}
					return false;
				} ).on( 'translate.owl.carousel', portoCarouselTranslateWPB );

				$wrap.find( '[data-plugin-carousel]:not(.manual), .porto-carousel:not(.manual)' ).each( function() {
					var $this = $( this ),
						opts;
					if ( $this.closest( '.tab-pane' ).length && ! $this.closest( '.tab-pane' ).hasClass( 'active' ) ) {
						return;
					}
					var pluginOptions = $this.data( 'plugin-options' );
					if ( pluginOptions )
						opts = pluginOptions;

					setTimeout( function() {
						$this.themeCarousel( opts );
					}, 0 );
				} );
			} );

		}

		// Thumb Gallery
		$wrap.find( '.thumb-gallery-thumbs, .thumbnail-gallery' ).each( function() {
			var $thumbs = $( this ),
				$detail = $thumbs.parent().find( '.thumb-gallery-detail' ),
				flag = false,
				duration = 300;

			if ( $thumbs.data( 'initThumbs' ) )
				return;

			$detail.on( 'changed.owl.carousel', function( e ) {
				if ( !flag ) {
					flag = true;
					var len = $detail.find( '.owl-item' ).length,
						cloned = $detail.find( '.cloned' ).length;
					if ( len ) {
						$thumbs.trigger( 'to.owl.carousel', [( e.item.index - cloned / 2 - 1 ) % len, duration, true] );
					}
					flag = false;
				}
			} );

			$thumbs.on( 'changed.owl.carousel', function( e ) {
				if ( !flag ) {
					flag = true;
					var len = $thumbs.find( '.owl-item' ).length,
						cloned = $thumbs.find( '.cloned' ).length;
					if ( len ) {
						$detail.trigger( 'to.owl.carousel', [( e.item.index - cloned / 2 ) % len, duration, true] );
					}
					flag = false;
				}
			} ).on( 'click', '.owl-item', function() {
				if ( !flag ) {
					flag = true;
					var len = $thumbs.find( '.owl-item' ).length,
						cloned = $thumbs.find( '.cloned' ).length;
					if ( len ) {
						$detail.trigger( 'to.owl.carousel', [( $( this ).index() - cloned / 2 ) % len, duration, true] );
					}
					flag = false;
				}
			} ).data( 'initThumbs', true );
		} );

		// Fixed video
		$wrap.find( '.video-fixed' ).each( function() {
			var $this = $( this ),
				$video = $this.find( 'video, iframe' );

			if ( $video.length ) {
				window.addEventListener( 'scroll', function() {
					var offset = $( window ).scrollTop() - $this.position().top + theme.adminBarHeight();
					$video.css( "cssText", "top: " + offset + "px !important;" );
				}, { passive: true } );
			}
		} );

		setTimeout( function() {
			// Search
			if ( typeof theme.Search !== 'undefined' ) {
				theme.Search.initialize();
			}
		}, 0 );

	};

	$( document.body ).trigger( 'porto_async_init' );
} ).apply( this, [window.theme, jQuery] );

jQuery( document ).ready( function( $ ) {
	'use strict';

	// Visual Composer Image Zoom
	if ( $.fn.themeVcImageZoom ) {

		$( function() {
			var $galleryParent = null;
			$( '.porto-vc-zoom:not(.manual)' ).each( function() {
				var $this = $( this ),
					opts,
					gallery = $this.attr( 'data-gallery' );

				var pluginOptions = $this.data( 'plugin-options' );
				if ( pluginOptions )
					opts = pluginOptions;

				if ( typeof opts == "undefined" ) {
					opts = {};
				}
				opts.container = $this.parent();

				if ( gallery == 'true' ) {
					var container = 'vc_row';

					if ( $this.attr( 'data-container' ) )
						container = $this.attr( 'data-container' );

					var $parent = $( $this.closest( '.' + container ).get( 0 ) );
					if ( $parent.length > 0 && $galleryParent != null && $galleryParent.is( $parent ) ) {
						return;
					} else if ( $parent.length > 0 ) {
						$galleryParent = $parent;
					}
					if ( $galleryParent != null && $galleryParent.length > 0 ) {
						opts.container = $galleryParent;
					}
				}

				$this.themeVcImageZoom( opts );
			} );
		} );
	}

	function porto_modal_open( $this ) {
		var trigger = $this.data( 'trigger-id' ),
			overlayClass = $this.data( 'overlay-class' ),
			extraClass = $this.data( 'extra-class' ) ? $this.data( 'extra-class' ) : '',
			type = $this.data( 'type' );
		if ( typeof trigger != 'undefined'/* && $('#' + escape(trigger)).length > 0*/ ) {
			if ( typeof type == 'undefined' ) {
				type = 'inline';
			}
			if ( type == 'inline' ) {
				trigger = '#' + escape( trigger );
			}
			var args = {
				items: {
					src: trigger
				},
				type: type,
				mainClass: extraClass
			};
			var $popupModal = $this;
			if ( $this.hasClass( 'porto-onload' ) ) {
				args['callbacks'] = {
					'beforeClose': function() {
						if ( $( '.mfp-wrap .porto-disable-modal-onload' ).length && ( $( '.mfp-wrap .porto-disable-modal-onload' ).is( ':checked' ) || $( '.mfp-wrap .porto-disable-modal-onload input[type="checkbox"]' ).is( ':checked' ) ) ) {
							$.cookie( 'porto_modal_disable_onload', 'true', { expires: 7 } );
						} else if ( 'undefined' !== typeof $popupModal.data( 'expired' ) && 'undefined' !== typeof $popupModal.data( 'popup-id' ) ) {
							$.cookie( 'porto_modal_disable_period_onload_' + $popupModal.data( 'popup-id' ), $popupModal.data('expired'), { expires: $popupModal.data('expired') } );
						}
					}
				};
			}
			if ( typeof overlayClass != "undefined" && overlayClass ) {
				args.mainClass += escape( overlayClass );
			}
			setTimeout( () => {
				$.magnificPopup.open( $.extend( true, {}, theme.mfpConfig, args ), 0 );
			} );

		}
	}

	function porto_init_magnific_popup_functions( $wrap ) {
		if ( typeof $wrap == 'undefined' || !$wrap.length ) {
			$wrap = $( document.body );
		}
		$wrap.find( '.lightbox:not(.manual)' ).each( function() {
			var $this = $( this ),
				opts;
			if ( $this.find( '>.lb-dataContainer' ).length ) {
				return;
			}
			var pluginOptions = $this.data( 'lightbox-options' );
			if ( pluginOptions ) {
				opts = pluginOptions;
			} else {
				pluginOptions = $this.data( 'plugin-options' );
				if ( typeof pluginOptions != 'object' ) {
					pluginOptions = JSON.parse( pluginOptions );
				}
				if ( pluginOptions ) {
					opts = pluginOptions;
				}
			}

			$this.themeLightbox( opts );
		} );

		// Popup with video or map
		$wrap.find( '.porto-popup-iframe' ).magnificPopup( $.extend( true, {}, theme.mfpConfig, {
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
		} ) );

		// Popup with ajax
		$wrap.find( '.porto-popup-ajax' ).magnificPopup( $.extend( true, {}, theme.mfpConfig, {
			type: 'ajax'
		} ) );

		// Popup with content
		$wrap.find( '.porto-popup-content' ).each( function() {
			var animation = $( this ).attr( 'data-animation' );
			$( this ).magnificPopup( $.extend( true, {}, theme.mfpConfig, {
				type: 'inline',
				fixedContentPos: false,
				fixedBgPos: true,
				overflowY: 'auto',
				closeBtnInside: true,
				preloader: false,
				midClick: true,
				removalDelay: 300,
				mainClass: animation
			} ) );
		} );

		// Porto Modal
		$wrap.find( '.popup-youtube, .popup-vimeo, .popup-gmaps' ).each( function( index ) {
			var overlayClass = $( this ).find( '.porto-modal-trigger' ).data( 'overlay-class' ),
				args = {
					type: 'iframe',
					removalDelay: 160,
					preloader: false,

					fixedContentPos: false
				};
			if ( typeof overlayClass != "undefined" && overlayClass ) {
				args.mainClass = escape( overlayClass );
			}
			$( this ).magnificPopup( args );
		} );

		if ( $wrap.find( '.porto-modal-trigger.porto-onload' ).length ) {
			var $obj = $wrap.find( '.porto-modal-trigger.porto-onload' ).eq( 0 ),
				timeout = 0;
			if ( $obj.data( 'timeout' ) ) {
				timeout = parseInt( $obj.data( 'timeout' ), 10 );
			}
			setTimeout( function() {
				porto_modal_open( $obj );
			}, timeout );
		}
		$wrap.on( 'click', '.porto-modal-trigger', function( e ) {
			e.preventDefault();
			porto_modal_open( $( this ) );
		} );

		/* Woocommerce */
		// login popup
		if ( $wrap.hasClass( 'login-popup' ) ) {
			$wrap.find( '.porto-link-login, .porto-link-register' ).magnificPopup( {
				items: {
					src: theme.ajax_url + '?action=porto_account_login_popup&nonce=' + js_porto_vars.porto_nonce,
					type: 'ajax'
				},
				tLoading: '<i class="porto-loading-icon"></i>',
				callbacks: {
					ajaxContentAdded: function() {
						$( window ).trigger( 'porto_login_popup_opened' );
					}
				}
			} );
		}

		$wrap.find( '.product-images' ).magnificPopup(
			$.extend( true, {}, theme.mfpConfig, {
				delegate: '.img-thumbnail a.zoom',
				type: 'image',
				gallery: { enabled: true }
			} )
		);
		$wrap.find( '.porto-posts-grid' ).each( function() {
			$( this ).magnificPopup(
				$.extend( true, {}, theme.mfpConfig, {
					delegate: '.porto-tb-featured-image span.zoom, .porto-tb-featured-image a.zoom, .post-image span.zoom',
					type: 'image',
					gallery: { enabled: true }
				} )
			);
		} );
		$wrap.find( '.porto-posts-grid .tb-image-type-slider div.zoom' ).each( function() {
			var $this = $( this ),
				links = [];
			$this.find( 'a' ).each( function() {
				var slide = {};
				slide.src = $( this ).attr( 'href' );
				slide.title = $( this ).attr( 'title' );
				links.push( slide );
			} );
			if ( links.length ) {
				$this.on( 'click', function() {
					var $slider = $this.siblings( '.porto-carousel' );
					if ( $slider.length ) {
						var offset = $slider.data( 'owl.carousel' ).current() - $slider.find( '.cloned' ).length / 2;
						$.magnificPopup.open( $.extend( true, {}, theme.mfpConfig, {
							items: links,
							gallery: {
								enabled: true
							},
							type: 'image'
						} ), offset );
					}
				} );
			}
		} );
	}

	if ( $.fn.magnificPopup ) {
		porto_init_magnific_popup_functions();
	} else {
		setTimeout( function() {
			if ( $.fn.magnificPopup ) {
				porto_init_magnific_popup_functions();
			}
		}, 500 );
	}
	$( document.body ).on( 'porto_load_posts_end', function( e, $posts_wrap ) {
		if ( $.fn.magnificPopup ) {
			porto_init_magnific_popup_functions( $posts_wrap );
		}
	} );


	// Post Filter
	if ( typeof theme.PostFilter !== 'undefined' ) {
		var $postFilterElements = $( 'ul[data-filter-type], .portfolio-filter, .member-filter, .faq-filter, .porto-ajax-filter.product-filter, .porto-ajax-filter.post-filter' );
		if ( $postFilterElements.length ) {
			theme.PostFilter.initialize( $postFilterElements );
		}
	}

	// Post ajax pagination
	$( 'body' ).on( 'click', '.porto-ajax-load .pagination:not(.load-more) .page-numbers', function( e ) {
		var $this = $( this );
		if ( $this.hasClass( 'current' ) || $this.hasClass( 'dots' ) ) {
			return;
		}
		e.preventDefault();
		var $wrap = $this.closest( '.porto-ajax-load' ),
			post_type = $wrap.data( 'post_type' ),
			$obj = $wrap.find( '.' + post_type + 's-container' );

		if ( !$obj.length || $wrap.hasClass( 'loading' ) ) {
			return;
		}
		$wrap.addClass( 'loading' );
		var $filter = $wrap.find( '.porto-ajax-filter' ),
			cat = $filter.length && $filter.children( '.active' ).length && $filter.children( '.active' ).data( 'filter' );
		if ( '*' == cat ) {
			cat = '';
		}
		var default_args = {},
			page = $this.attr( 'href' ).match( /paged=(\d+)|page\/(\d+)/ );

		if ( page && Array.isArray( page ) && ( page[1] || page[2] ) ) {
			default_args['page'] = parseInt( page[1] || page[2] );
		} else {
			if ( $this.hasClass( 'prev' ) ) {
				default_args['page'] = parseInt( $this.next().text() );
			} else if ( $this.hasClass( 'next' ) ) {
				default_args['page'] = parseInt( $this.prev().text() );
			} else {
				default_args['page'] = parseInt( $this.text() );
			}
		}
		if ( cat == '' && $wrap.find( 'input[type=hidden].category' ).length ) {
			cat = $wrap.find( 'input[type=hidden].category' ).val();
			default_args['taxonomy'] = $wrap.find( 'input[type=hidden].taxonomy' ).val();
		}
		theme.PostFilter.load_posts( cat, $wrap.hasClass( 'load-infinite' ), $wrap, post_type, $obj, default_args, $this.attr( 'href' ) );

	} );


	// Filter Zooms
	if ( typeof theme.FilterZoom !== 'undefined' ) {
		// Portfolio Filter Zoom
		theme.FilterZoom.initialize( $( '.page-portfolios' ) );
		// Member Filter Zoom
		theme.FilterZoom.initialize( $( '.page-members' ) );
		// Posts Related Style Filter Zoom
		theme.FilterZoom.initialize( $( '.blog-posts-related' ) );
	}

	// Image Hover Overlay on Posts Grid widget
	function portoSetHoverImage( $this, enter = true ) {
		var $item = $this.find( '[data-hoverlay-image]' ),
			$postsGrid = $this.closest( '.porto-posts-grid' );
		if ( $item.length ) {
			var $target = $postsGrid.find( '#himg-' + $item.data( 'hoverlay-id' ) );
			if ( enter ) {
				$target.addClass( 'active' );
				$postsGrid.addClass( 'active' );
			} else {
				$target.removeClass( 'active' );
				$postsGrid.removeClass( 'active' );
			}
		}
	}

	function InsertHoverImage( $this ) {
		var $option = $this.data( 'hoverlay-image' ),
			$postsGrid = $this.closest( '.porto-posts-grid' ),
			$postsWrap = $this.closest( '.posts-wrap' );

		// Overlay Image
		$postsGrid.append( '<div class="thumb-info-full" style="background-image: url(' + $option.src + '); --porto-himg-height:' + $postsWrap.innerHeight() + 'px;" id="himg-' + $option.id + '"></div>' );
		$postsGrid.addClass( 'image-hover-overlay' );


		// Resize
		if ( $postsWrap.hasClass( 'owl-carousel' ) ) {
			$postsWrap.on( 'refreshed.owl.carousel resized.owl.carousel', function() {
				$postsGrid.find( '.thumb-info-full' ).css( '--porto-himg-height', ( $postsWrap.innerHeight() + 'px' ) );
			} )
		} else {
			$( window ).on( 'resize', function() {
				$postsGrid.find( '.thumb-info-full' ).css( '--porto-himg-height', ( $postsWrap.innerHeight() + 'px' ) );
			} );
		}

		// Hover
		$( '.image-hover-overlay' ).on( 'mouseenter touchstart', '.porto-tb-item', function( e ) {
			portoSetHoverImage( $( this ) );
		} );
		$( '.image-hover-overlay' ).on( 'mouseleave touchend', '.porto-tb-item', function( e ) {
			portoSetHoverImage( $( this ), false );
		} );
	}

	// expose to scope
	$.extend( theme, {
		InsertHoverImage: InsertHoverImage
	} );

	$( '.porto-posts-grid [data-hoverlay-image]' ).each( function() {
		theme.InsertHoverImage( $( this ) );
	} );

	// close popup using esc key
	var $minicart_offcanvas = $( '.minicart-offcanvas' ),
		$wl_offcanvas = $( '.wishlist-offcanvas' ),
		$mobile_sidebar = $( '.mobile-sidebar' ),
		$mobile_panel = $( '#side-nav-panel' ),
		$overlay_search = $( '#header .btn-close-search-form' ),
		$html = $( 'html' );
	if ( $minicart_offcanvas.length || $wl_offcanvas.length || $mobile_sidebar.length || $mobile_panel.length || $( '.skeleton-loading' ).length || $overlay_search.length ) {
		$( document.documentElement ).on( 'keyup', function( e ) {
			try {
				if ( e.keyCode == 27 ) {
					$minicart_offcanvas.removeClass( 'minicart-opened' );
					$wl_offcanvas.removeClass( 'minicart-opened' );
					if ( $mobile_sidebar.length ) {
						$html.removeClass( 'filter-sidebar-opened' );
						$html.removeClass( 'sidebar-opened' );
						$( '.sidebar-overlay' ).removeClass( 'active' );
					}
					if ( $mobile_panel.length && $html.hasClass( 'panel-opened' ) ) {
						$html.removeClass( 'panel-opened' );
						$( '.panel-overlay' ).removeClass( 'active' );
					}
					if ( $overlay_search.length ) {
						$overlay_search.trigger( 'click' );
					}
				}
			} catch ( err ) { }
		} );
		$( '.skeleton-loading' ).on( 'skeleton-loaded', function() {
			$mobile_sidebar = $( '.mobile-sidebar' );
		} );
	}

	// Mouse Parallax
	if ( $.fn.themeMouseparallax ) {
		$( function() {
			$( '[data-plugin="mouse-parallax"]' ).each( function() {
				var $this = $( this ),
					opts;
				if ( $this.data( 'parallax' ) ) {
					$this.parallax( 'disable' );
					$this.removeData( 'parallax' );
					$this.removeData( 'options' );
				}
				if ( $this.hasClass( 'elementor-element' ) ) {
					$this.children( '.elementor-widget-container, .elementor-container, .elementor-widget-wrap, .elementor-column-wrap' ).addClass( 'layer' ).attr( 'data-depth', $this.attr( 'data-floating-depth' ) );
				} else {
					$this.children( '.layer' ).attr( 'data-depth', $this.attr( 'data-floating-depth' ) );
				}

				var pluginOptions = $this.data( 'options' );
				if ( pluginOptions )
					opts = pluginOptions;

				$this.themeMouseparallax( opts );
			} );
		} );
	}

	if ( $.fn['themePluginReadMore'] && $( '[data-plugin-readmore]' ).length ) {
		$( '[data-plugin-readmore]:not(.manual)' ).themePluginReadMore();
	}

	// Hover Split
	if ( $.fn.themePluginHoverSplit ) {
		$( '.mouse-hover-split' ).each( function() {
			var $this = $( this ),
				// Elmentor
				$splitSlide = $this.find( '>.split-slide' );
			if ( $splitSlide.length >= 2 ) {
				$this.themePluginHoverSplit();
			}
		} );
	}

	// Horizontal Scroller
	if ( $.fn.themePluginHScroller ) {
		// Horizontal Scroller
		$( '.horizontal-scroller-wrapper' ).each( function() {
			$( this ).themePluginHScroller( true );
		} );
	}

	// Text Hover Floating Image
	if ( $.fn.themePluginTIFloating ) {
		$( '.thumb-info-floating-element-wrapper[data-plugin-tfloating]' ).each( function() {
			$( this ).themePluginTIFloating();
		} );
	}
} );

( function( theme, $ ) {
	// init wishlist off-canvas
	if ( $( '.wishlist-popup' ).length ) {
		var worker = null;

		$( '.wishlist-offcanvas .my-wishlist' ).on( 'click', function( e ) {
			e.preventDefault();
			$( this ).parent().toggleClass( 'minicart-opened' );
		} );
		$( '.wishlist-offcanvas .minicart-overlay' ).on( 'click', function() {
			$( this ).closest( '.wishlist-offcanvas' ).removeClass( 'minicart-opened' );
		} );

		var init_wishlist = function() {
			worker = new Worker( js_porto_vars.ajax_loader_url.replace( '/images/ajax-loader@2x.gif', '/js/woocommerce-worker.js' ) );
			worker.onmessage = function( e ) {
				$( '.wishlist-popup' ).html( e.data );
			};
			worker.postMessage( { initWishlist: true, ajaxurl: theme.ajax_url, nonce: js_porto_vars.porto_nonce } );
		};

		if ( theme && theme.isLoaded ) {
			setTimeout( function() {
				init_wishlist();
			}, 100 );
		} else {
			$( window ).on( 'load', function() {
				init_wishlist();
			} );
		}

		// remove from wishlist
		$( '.wishlist-popup' ).on( 'click', '.remove_from_wishlist', function( e ) {
			e.preventDefault();

			var $this = $( this ),
				id = $this.attr( 'data-product_id' ),
				$table = $( '.wishlist_table #yith-wcwl-row-' + id + ' .remove_from_wishlist' );

			$this.closest( '.wishlist-item' ).find( '.ajax-loading' ).show();

			if ( $table.length ) {
				$table.trigger( 'click' );
			} else {
				if ( typeof yith_wcwl_l10n !== 'undefined' ) {
					$.ajax( {
						url: yith_wcwl_l10n.ajax_url,
						data: {
							action: yith_wcwl_l10n.actions.remove_from_wishlist_action,
							remove_from_wishlist: id,
							nonce: typeof yith_wcwl_l10n.nonce !== 'undefined' ? yith_wcwl_l10n.nonce.remove_from_wishlist_nonce : '',
							from: 'theme'
						},
						method: 'post',
						success: function( data ) {
							var $wcwlWrap = $( '.yith-wcwl-add-to-wishlist.add-to-wishlist-' + id );
							if ( $wcwlWrap.length ) {
								var fragmentOptions = $wcwlWrap.data( 'fragment-options' ),
									$link = $wcwlWrap.find( 'a' );
								if ( $link.length ) {
									if ( fragmentOptions.in_default_wishlist ) {
										delete fragmentOptions.in_default_wishlist;
										$wcwlWrap.attr( JSON.stringify( fragmentOptions ) );
									}
									$wcwlWrap.removeClass( 'exists' );
									$wcwlWrap.find( '.yith-wcwl-wishlistexistsbrowse' ).addClass( 'yith-wcwl-add-button' ).removeClass( 'yith-wcwl-wishlistexistsbrowse' );
									$wcwlWrap.find( '.yith-wcwl-wishlistaddedbrowse' ).addClass( 'yith-wcwl-add-button' ).removeClass( 'yith-wcwl-wishlistaddedbrowse' );
									$link.attr( 'href', location.href + '?post_type=product&amp;add_to_wishlist=' + id ).attr( 'data-product-id', id ).attr( 'data-product-type', fragmentOptions.product_type );
									var text = $( '.single_add_to_wishlist' ).data( 'title' );
									if ( !text ) {
										text = 'Add to wishlist';
									}
									$link.attr( 'title', text ).attr( 'data-title', text ).addClass( 'add_to_wishlist single_add_to_wishlist' ).html( '<span>' + text + '</span>' );
								}
							}
							$( document.body ).trigger( 'removed_from_wishlist' );
							//$this.closest('.wishlist-item').remove();
						}
					} );
				}
			}
		} );

		$( document.body ).on( 'added_to_wishlist removed_from_wishlist', function( e ) {
			if ( worker ) {
				worker.postMessage( { loadWishlist: true, ajaxurl: theme.ajax_url, nonce: js_porto_vars.porto_nonce } );
			}
		} );
	}
	
	// Hide Tooltip before adding to wishlist
	$( document ).on( 'yith_wcwl_add_to_wishlist_data', function( e, $el ) {
		if ( $el.length ) {
			$el.tooltip( 'hide' );
		}
	} );
} ).apply( this, [window.theme, jQuery] );