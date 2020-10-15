// TODO: Only call library for logged in users (for demo it is being called
//  for all users via utils.js in ps_core.
// TODO: Explore conflicts between Popper v2 (d9) and Popper v1 (d8)
// TODO: instagram just blows up. let's just alert the whole social panel as a warning.

// Note: links and images are ignoring the social embed block.

jQuery(document).ready(function($){

    // todo set defaults

    var Sa11y = new Sa11y();

    function Sa11y() {
        /* When checked, save to LocalStorage. Keeps checker active when navigating between pages until it is toggled off.
        Added setTimeout function to (unscientifically) give a little time to load any other content or slow post-rendered JS, iFrames, etc. */

        $(function () {

            // 1. Always run scan.
            // 2. If they prefer the panel closed, only show on alerts
            // 3. If they have ignored the alerts on this page, let panel stay
            //    closed until the content changes.
            setTimeout(function () {
                // Prevent running in admin mode
                // Todo: move the admin detector logic to Drupal.
                if (!document.getElementById('block-ps-seven-content') && !document.getElementById('layout-builder')) {

                    let sa11yStart = localStorage.getItem("sa11y-status");
                    this.sa11ySeen = localStorage.getItem("sa11y-seen");
                    if (sa11yStart === "hide") {
                        loadSeenLog();
                        if (this.seenArray[this.thisNode] && this.seenArray[this.thisNode] !== this.nodeLength) {
                            sa11yStart = "show";
                            // Remove stale ignore requests.
                            storeSeenLog(false);
                        }
                    }

                    $("input[name='sa11y-start']").prop('checked', true);
                    Sa11y.checkAll(true,sa11yStart ? sa11yStart : "show");
                }
            }, 500);

            // Handle main toggle.
            $("input[name='sa11y-start']").click(function () {
                $('body').addClass('no-stick');
                if ($('.sa11y-panel').hasClass('sa11y-active') !== true) {
                    localStorage.setItem("sa11y-status", "show");
                    Sa11y.checkAll(false, "show");
                } else {
                    localStorage.setItem("sa11y-status", "hide");
                    Sa11y.checkAll(false, "hide");
                    storeSeenLog(true);
                }
            });

            // Escape key on main shuts down.
            $(sa11yCheckRoot).keyup(function (escape) {
                if (escape.keyCode == 27 && $('#sa11y-panel').hasClass('sa11y-active')) {
                    tippy.hideAll()
                    localStorage.setItem("sa11y-start", "hide");
                    Sa11y.checkAll(false, "hide");
                } else {
                    this.onkeyup = null;
                }
            });
            //Bind enter key to checkbox.
            $('#sa11y-checkbox').keydown(function (ev) {
                if (ev.keyCode == 13) $(ev.target).click();
            })

        });

        // We keep records of the content length in characters when the user
        // last closed the panel, and only force it open if the content changed.
        function loadSeenLog() {
            this.seenArray = JSON.parse(sa11ySeen);
            this.nodeLength = $(sa11yCheckRoot).text().length;
            this.thisNode = btoa(encodeURIComponent(window.location.pathname));
        }
        function storeSeenLog(add) {
            if (!this.nodeLength) {
                loadSeenLog();
            }
            if (add === true) {
                this.seenArray[this.thisNode] = this.nodeLength;
                localStorage.setItem('sa11y-seen', JSON.stringify(this.seenArray));
            }
            else {
                delete this.seenArray[this.thisNode];
                localStorage.setItem('sa11y-seen', JSON.stringify(this.seenArray));
            }
        }

        /* Templated SVG icons from FontAwesome 5 for better cross-browser support and minimize conflicting libraries. */

        var MainToggleIcon = "<svg role='img' focusable='false' width='28px' height='28px' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='#ffffff' d='M256 48c114.953 0 208 93.029 208 208 0 114.953-93.029 208-208 208-114.953 0-208-93.029-208-208 0-114.953 93.029-208 208-208m0-40C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 56C149.961 64 64 149.961 64 256s85.961 192 192 192 192-85.961 192-192S362.039 64 256 64zm0 44c19.882 0 36 16.118 36 36s-16.118 36-36 36-36-16.118-36-36 16.118-36 36-36zm117.741 98.023c-28.712 6.779-55.511 12.748-82.14 15.807.851 101.023 12.306 123.052 25.037 155.621 3.617 9.26-.957 19.698-10.217 23.315-9.261 3.617-19.699-.957-23.316-10.217-8.705-22.308-17.086-40.636-22.261-78.549h-9.686c-5.167 37.851-13.534 56.208-22.262 78.549-3.615 9.255-14.05 13.836-23.315 10.217-9.26-3.617-13.834-14.056-10.217-23.315 12.713-32.541 24.185-54.541 25.037-155.621-26.629-3.058-53.428-9.027-82.141-15.807-8.6-2.031-13.926-10.648-11.895-19.249s10.647-13.926 19.249-11.895c96.686 22.829 124.283 22.783 220.775 0 8.599-2.03 17.218 3.294 19.249 11.895 2.029 8.601-3.297 17.219-11.897 19.249z'/></svg>",
            ErrorIcon = "<svg xmlns='http://www.w3.org/2000/svg' role='img' focusable='false' aria-hidden='true' viewBox='0 0 576 576' width='24px' height='24px'><path fill='#ffffff' d='M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z'></path></svg><span class='sa11y-sr-only'>Error</span>",
            WarningIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='28px' height='28px' role='img' focusable='false' aria-hidden='true' viewBox='0 0 512 512'><path fill='#505050' d='M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z'/></svg><span class='sa11y-sr-only'>Warning</span>",
            PanelCheckIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' role='img' focusable='false' aria-hidden='true' viewBox='0 0 512 512' ><path fill='#359E56' d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z'/></svg>",
            PanelWarningIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' role='img' focusable='false' aria-hidden='true' viewBox='0 0 512 512'><path fill='#d39c00' d='M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z'/></svg>",
            PanelErrorIcon = "<svg xmlns='http://www.w3.org/2000/svg' role='img' focusable='false' aria-hidden='true' viewBox='0 0 576 512' width='24px' height='24px'><path fill='#d30017' d='M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z'></path></svg>"

        // States of the outlines, used to toggle the outlines.
        this.showingHeaders = false;
        this.showingLinkText = false;
        this.showingLabels = false;
        this.showingAltText = false;
        this.showingQA = false;
        

        // Create a floating button and hidden divs that contain success/warning message.
        var sa11ycontainer = document.createElement("div");
        sa11ycontainer.setAttribute("id", "sa11y-container");
        //Main button uses checkbox input to pass value for localstorage.
        //<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-content="' + error + '" >' + WarningIcon + '</button>
        sa11ycontainer.innerHTML = "<input class='sa11y-hide-native-checkbox' id='sa11y-checkbox' type='checkbox' name='sa11y-start'><label class='sa11y-main-toggle-style sa11y-preload' for='sa11y-checkbox'><span class='sa11y-x' aria-hidden='true'>&times;</span>" + MainToggleIcon + "<span class='sa11y-sr-only'>Accessibility Scan found</span><span class='sa11y-count sa11y-preload'></span><span class='sa11y-sr-only'>items</span></label>"
            +
            "<div id='sa11y-panel' class='sa11y-panel'>" +

            "<div id='sa11y-fullcheck-headers' class='sa11y-outline-header sa11y-fullcheck'>" +
                "<div id='sa11y-fullcheck-outline-header' class='sa11y-bold sa11y-instance sa11y-fullcheck-header'>Check page outline" +
                "<button type='button' class='sa11y-help sa11y-header-button' data-tippy-content='" +
                "<p>Check that everything that looks like a heading appears on this list, in the correct position</p>" +
                "<p><a href=&quot;https://accessibility.princeton.edu/how/content/headings&quot;>About accessible headings</a></p>" +
                "'><span aria-hidden='true'>?</span>" +
                "<span class='sa11y-sr-only'>hide</span></button></div>" +
                "<button type='button' class='sa11y-next-button sa11y-header-button'>Next<span aria-hidden='true'> &raquo;</span></button>" +
                "<button type='button' class='sa11y-close-button sa11y-header-button'><span aria-hidden='true'>&minus;</span><span class='sa11y-sr-only'>hide</span></button>" +
                "<ul id='sa11y-outline-list' tabindex='-1' aria-labelledby='sa11y-fullcheck-headers'></ul>" +
            "</div>"
            +
            "<div id='sa11y-fullcheck-images' class='sa11y-outline-header sa11y-fullcheck'>" +
                "<div id='sa11y-image-header' class='sa11y-bold sa11y-instance sa11y-fullcheck-header'>Check text alternatives" +
                "<button type='button' class='sa11y-help sa11y-header-button' data-tippy-content='" +
                "<p>Check that every image has <a href=&quot;https://accessibility.princeton.edu/how/content/alternative-text&quot;>good alt text</a>, " +
                "there are (ideally) no <a href=&quot;https://accessibility.princeton.edu/how/content/images-text&quot;>images of text</a>, " +
                "and every <a href=&quot;https://accessibility.princeton.edu/policy/video&quot;>video is captioned</a>.</p>" +
                "'><span aria-hidden='true'>?</span>" +
                "<span class='sa11y-sr-only'>hide</span></button></div>" +
                "<button type='button' class='sa11y-next-button sa11y-header-button'>Next<span aria-hidden='true'> &raquo;</span></button>" +
                "<button type='button' class='sa11y-close-button sa11y-header-button'><span aria-hidden='true'>&minus;</span><span class='sa11y-sr-only'>hide</span></button>" +
                "<ul id='sa11y-image-list' tabindex='-1' aria-labelledby='sa11y-fullcheck-outline-header'></ul>" +
                "</div>" +
            "<div id='sa11y-no-errors' role='alert' class='sa11y-panel-header'><button type='button' class='sa11y-close-button sa11y-button'><span aria-hidden='true'>&minus;</span><span class='sa11y-sr-only'>hide</span></button><div class='sa11y-th-img'>" + PanelCheckIcon + "</div><div class='sa11y-td-msg'><span class='sa11y-checktype'>Quick check</span> found no accessibility errors. Nicely done.</div></div>" +
            "<div id='sa11y-warnings' role='alert' class='sa11y-panel-header'><button type='button' class='sa11y-close-button sa11y-button'><span aria-hidden='true'>&minus;</span><span class='sa11y-sr-only'>hide</span></button><div class='sa11y-th-img'>" + PanelWarningIcon + "</div>" +
                "<div class='sa11y-td-msg'><span class='sa11y-checktype'>Quick check</span> found <span class='sa11y-panelcount'>a potential issue</span>. <a href='#' class='sa11y-jumplink'>Show <span class='sa11y-jumpnext'></span><span aria-hidden='true'>»</span></a></div></div>" +
            "<div id='sa11y-errors-found' role='alert' class='sa11y-panel-header'><button type='button' class='sa11y-close-button sa11y-button'><span aria-hidden='true'>&minus;</span><span class='sa11y-sr-only'>hide</span></button><div class='sa11y-th-img'>" + PanelErrorIcon + "</div>" +
                "<div class='sa11y-td-msg'><span class='sa11y-checktype'>Quick check</span> found <span class='sa11y-panelcount'>a potential issue</span> on this page. <a href='#' class='sa11y-jumplink'>Show <span class='sa11y-jumpnext'></span> <span aria-hidden='true'>»</span></a></div></div>" +

            "<button type='button' aria-expanded='false' id='sa11y-summary-toggle' class='sa11y-button sa11y-panel-button'>Full check</button>" +
            "<button type='button' id='sa11y-maximize' class='sa11y-button sa11y-panel-button'>Show panel</button>" +
            "<button type='button' id='sa11y-shutpanel' class='sa11y-button sa11y-panel-button'>Hide all<span class='sa11y-count' aria-hidden='true'></span></button>"
            +
            "</div>";

        $(sa11yCheckRoot).prepend(sa11ycontainer);

        this.goto = 0;
        $('.sa11y-jumplink').click(function(event) {
            event.preventDefault();
            // Princeton only
            $('body').addClass('no-stick');
            let $goto = $('button[class^="sa11y"][data-tippy-content]').not('#sa11y-container button');
            $goto.eq(Sa11y.goto).focus();
            let gotoOffset = $goto.eq(Sa11y.goto).offset().top - parseInt($('body').css('padding-top')) - 50;
            $('html, body').animate({
                scrollTop: (gotoOffset)
            },1);
            $('#header').removeClass('stuck');
            $goto.eq(Sa11y.goto).click();
            let sa11yGotoText = 'next';
            if ($goto.length - 1 === Sa11y.goto) {
                Sa11y.goto = 0;
                sa11yGotoText = 'first';
            }
            else {
                Sa11y.goto++;
            }
            window.setTimeout(function () {
                $('#header').removeClass('stuck');
                $('.sa11y-jumpnext').text(sa11yGotoText);
            }, 500);
        })

        $('.sa11y-panel-header .sa11y-close-button').click(function(event) {
            event.preventDefault();
            $('#sa11y-container').addClass('sa11y-minimized');
        })

        $('.sa11y-fullcheck .sa11y-close-button').click(function(event) {
            event.preventDefault();
            $('#sa11y-summary-toggle').click();
        })


        // Todo this isn't working
        $('#sa11y-maximize').click(function(event) {
            event.preventDefault();
            $('#sa11y-container').removeClass('sa11y-minimized');
        });

        $('#sa11y-shutpanel').click(function(event) {
            event.preventDefault();
            $('#sa11y-checkbox').focus().click();
        })

        $('.sa11y-next-button').click(function(event) {
            event.preventDefault();
            // Todo write actual next/previous logic when there are more than two
            $(this).parent().siblings('.sa11y-fullcheck').addClass('sa11y-active');
            $(this).parent().removeClass('sa11y-active');
        })

        // State of errors on page. Used to toggle pass message.
        this.errorCount = 0;
        this.warningCount = 0;
        this.panelActive = false;

        // Toggles the outline of all headers, link texts, and images.
        this.checkAll = function (onLoad, showPanel) {
            this.errorCount = 0;
            this.warningCount = 0;
            this.checkHeaders();
            this.checkLabels();
            this.checkAltText();
            this.checkLinkText();
            this.checkQA();

            if (showPanel === "hide" && onLoad === false) {
                // Just close panel on click
                Sa11y.reset();
                this.panelActive = false;
            }
            else {
                this.updatePanel(onLoad, showPanel);
                this.panelActive = true;
                this.tippyInit();
            }
        };

        this.tippyInit = function(selector = '[data-tippy-content]') {
            //Initialize tippy.js
            $('.sa11y-instance button, .sa11y-instance-inline button').not('tippy-ready').each(function(){
                $(this).addClass('tippy-ready').attr('data-tippy-content',  '<button class="tippy-closer sa11y-close-button sa11y-button" type="button" onClick="jQuery(this).closest(&#34;[id^=&#39;tippy&#39;]&#34;).siblings(&#39;button&#39;).focus().click();"><span class="aria-hidden">&times;</span><span class="sa11y-sr-only">close</span></button>' + $(this).attr('data-tippy-content'));
            })
            tippy(selector, {
                onShown(instance) {
                    $('body').addClass('no-stick');
                    $('[id^="tippy"]').not('#tippy-'+instance.id).each(function(){
                        $(this).siblings('button').click();
                    });
                },
                interactive: true,
                trigger: 'mouseover click',
                arrow: true,
                theme: 'sa11y-theme',
                allowHTML: true,
                appendTo: document.main,
                placement: 'auto-end'
            });
        }

        $("#sa11y-summary-toggle").click(function () {
            $(this).text(function (i, v) {
                return v === 'Full check' ? 'Hide full check' : 'Full check'
            });
            $(this).toggleClass("sa11y-btn-active");
            $(this).attr('aria-expanded', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            if ($(this).attr('aria-expanded') === 'false') {
                // Close and remove
                $(".sa11y-fullcheck").removeClass("sa11y-active");
                $('.sa11y-reveal-formatting').remove();
                $('.sa11y-headings-label').hide();
                $("#sa11y-image-list li").remove();
                $(".sa11y-full-active").removeClass('sa11y-full-active').addClass('sa11y-full-only');
            }
            else {
                Sa11y.checkFull();
                $("#sa11y-fullcheck-headers").addClass("sa11y-active");
                $(".sa11y-full-only").removeClass('sa11y-full-only').addClass('sa11y-full-active');
                $("#sa11y-outline-list").focus();
                $('.sa11y-headings-label').show();
                $('.main-container img').each(function() {
                    let alt = $(this).attr('alt');
                    let width = $(this).innerWidth() + 'px';
                    let height = $(this).innerHeight() + 'px';
                    let inject = "<div class='sa11y-container sa11y-reveal-formatting' " +
                        "style='width:"+width+";height:"+height+";'>" +
                        "<span>"+MainToggleIcon+"Image alt text: "+alt+"</span></div>";
                    if ($(this).prev().hasClass('sa11y-instance-inline') === true) {
                        $(this).prev().before(inject);
                    }
                    else {
                        $(this).before(inject);
                    }
                    let src = $(this).attr('src');
                    let imgClass = "";
                    if ($(this).hasClass('sa11y-error-border')) {
                        imgClass = " sa11y-error-border";
                    } else if ($(this).hasClass('sa11y-warning-border')) {
                        imgClass = " sa11y-warning-border";
                    }
                    $('#sa11y-image-list').append("" +
                        "<li class='"+ imgClass  +"'>" +
                        "<img src='" + src + "' alt='' class='sa11y-thumbnail'/>Alt: " + alt + "</li>");
                });
            }
        });

        window.addEventListener('resize', function () {
            if ($('#sa11y-summary-toggle').attr('aria-expanded') === 'true') {
                $('.main-container img').each(function() {
                    let width = $(this).innerWidth() + 'px';
                    let height = $(this).innerHeight() + 'px';
                    $(this).prevAll('.sa11y-reveal-formatting').css({
                        'width': width,
                        'height': height
                    });
                })
            }
        });

        this.updatePanel = function (onLoad, showPanel) {
            $('.sa11y-preload').removeClass('sa11y-preload');
            $('.sa11y-minimized').removeClass('sa11y-minimized');
            $("#sa11y-summary-toggle").addClass("sa11y-active");
            // If there are errors, always show the panel.
            // If there are only warnings, only show by preference.
            this.updateCount('quick');

            if (this.errorCount === 0) {

                if (this.warningCount === 0 && onLoad === false && showPanel === "show") {
                    $("#sa11y-panel").addClass("sa11y-active");
                    $("#sa11y-summary-toggle").addClass("sa11y-active");
                    $("#sa11y-no-errors").addClass("sa11y-active");
                }
                else if (this.warningCount > 0 && showPanel === "show") {
                    // Display a warning message if only warnings are found.
                    $("#sa11y-panel").addClass("sa11y-active");
                    $("#sa11y-no-errors").removeClass("sa11y-active");
                    $("#sa11y-warnings").addClass("sa11y-active");
                    $(".sa11y-main-toggle-style").addClass("sa11y-toggle-active");
                }
                // Remove wraps, hide panel.
                else {
                    Sa11y.reset();
                }

                $("#allytogglebtn").click(function (event) {
                    event.stopPropagation();
                });

            }
            else {
                // When there are alerts, immediately show unless they
                // have already seen them.
                if (onLoad !== true || showPanel === "show") {
                    $("#sa11y-panel").addClass("sa11y-active");
                    $(".sa11y-main-toggle-style").addClass("sa11y-toggle-active");
                    $("#sa11y-summary-toggle").addClass("sa11y-active");
                    $("#sa11y-errors-found").addClass("sa11y-active");
                    $("#sa11y-no-errors").removeClass("sa11y-active");
                    $("#sa11y-warnings").removeClass("sa11y-active");
                } else {
                    Sa11y.reset();
                }
            }

        }

        // Show a warning/error count on the toggle button.
        this.updateCount = function (checkType) {
            let totalCount = this.errorCount + this.warningCount;
            $('.sa11y-count').text(totalCount);
            if (totalCount > 1) {
                $('.sa11y-jumpnext').text('first');
            }

            $('.sa11y-checktype').text(checkType === 'quick' ? 'Quick check' : 'Full check');
            $('.sa11y-panelcount').text(this.errorCount === 1 ? 'a potential issue' : this.errorCount + this.warningCount + ' issues');
            $('.sa11y-count, .sa11y-count + span').show();
            if (this.errorCount > 0) {
                $(".sa11y-main-toggle-style").addClass("sa11y-toggle-errors");
                $("#sa11y-errors-found").addClass("sa11y-active");
                $("#sa11y-no-errors").removeClass("sa11y-active");
                $("#sa11y-warnings").removeClass("sa11y-active");
            }
            else if (this.warningCount > 0) {
                $(".sa11y-main-toggle-style").addClass("sa11y-toggle-warnings");
                $("#sa11y-errors-found").removeClass("sa11y-active");
                $("#sa11y-no-errors").removeClass("sa11y-active");
                $("#sa11y-warnings").addClass("sa11y-active");
            }
            else {
                $('.sa11y-count, .sa11y-count + span').hide();
                $(".sa11y-main-toggle-style").removeClass("sa11y-toggle-warnings sa11y-toggle-errors");
            }
        }

        // Resets all changes made by the tool. Removing outlines and additional spans.
        this.reset = function () {
            this.clearEverything();
            this.showingAltText = false;
            this.showingHeaders = false;
            this.showingLinkText = false;
            this.showingLabels = false;
            this.showingQA = false;
            this.noErrors = true; //Reset page to "no errors" instead of refreshing page.
            this.anyWarning = false;
            this.showingFull = false;
        };

        this.clearEverything = function () {

            //Remove error outlines
            $(sa11yCheckRoot).find(".sa11y-text-warning").removeClass("sa11y-text-warning");
            $(sa11yCheckRoot).find(".sa11y-link-text-warning").removeClass("sa11y-link-text-warning");
            $(sa11yCheckRoot).find(".sa11y-error-border").removeClass("sa11y-error-border");
            $(sa11yCheckRoot).find(".sa11y-warning-border").removeClass("sa11y-warning-border");
            $(sa11yCheckRoot).find(".sa11y-headings-fail").removeClass("sa11y-headings-fail");
            $(sa11yCheckRoot).find(".sa11y-link-text-fail").removeClass("sa11y-link-text-fail");
            $(sa11yCheckRoot).find(".sa11y-uppercase-warning").contents().unwrap();

            //Remove buttons and highlights
            $(sa11yCheckRoot).find(".sa11y-instance").not('#sa11y-panel .sa11y-instance').remove();
            $(sa11yCheckRoot).find(".sa11y-instance-inline").remove();
            $(sa11yCheckRoot).find(".sa11y-error-btn").remove();
            $(sa11yCheckRoot).find(".sa11y-error-text-btn").remove();
            $(sa11yCheckRoot).find(".sa11y-link-warning-btn").remove();
            $(sa11yCheckRoot).find(".sa11y-warning-btn").remove();
            $(sa11yCheckRoot).find(".sa11y-headings-label").remove();
            $(sa11yCheckRoot).find(".sa11y-reveal-formatting").remove();

            //Remove and reset panels and active items
            $(".sa11y-error-message").remove();
            $(".sa11y-pass-message").remove();
            $(".sa11y-warning-message").remove();
            $(".sa11y-popover").remove();
            $(".sa11y-main-toggle-style").removeClass("allytogglefocus sa11y-toggle-active");
            $(".sa11y-fullcheck li").remove();
            $(".sa11y-active").removeClass("sa11y-active");
        }

        /*================== HEADING STRUCTURE MODULE ===================*/

        this.checkHeaders = function () {
            if (this.showingHeaders) {
                this.clearEverything();
                this.showingHeaders = false;
            } else {
                this.outlineHeaders();
                this.showingHeaders = true;
            }
        };

        this.outlineHeaders = function () {
            // Reset panel; we rebuild on each run.
            $("#sa11y-outline-list li, .sa11y-headings-label").remove();

            // Only fetch headers within the content area.
            let $headings = $(sa11yCheckRoot).find("h1, h2, h3, h4, h5, h6, [role='heading'][aria-level]").not("[aria-hidden='true']").not(sa11yHeaderIgnore);
            let prevLevel;

            // Test each header level for accessibility issues.
            $headings.each((i, el) => {
                let $el = $(el);
                let level;
                // Match up aria-headers to equivalent <h#> tag.
                if ($el.attr('aria-level')) {
                    level = + $el.attr('aria-level');
                } else {
                    level = + $el.prop("tagName").slice(1);
                }
                let error = null;
                let errorLevel = false;
                let tippyIcon = "";
                let headingLength = $el.text().trim().length;

                if (prevLevel && level - prevLevel > 1) {
                  this.errorCount++;
                  error = "<div class='tippy-heading'><span class='sa11y-bold sa11y-red-text'>Error</span>: Headings jump from " + prevLevel + " to " + level + "</div>" +
                      "<p><a href='https://accessibility.princeton.edu/how/content/headings'>Headings should form a page outline</a> for screen readers.</p> " +
                      "<p>To fix: If this is related to the previous heading, please change it to <span class='sa11y-bold'>Heading " + parseInt(prevLevel + 1) +
                      "</span>. If it starts a new section, mark it <span class='sa11y-bold'>Heading " + prevLevel + "</span>.</p>";
                  errorLevel = true;
                  tippyIcon = '<div class="sa11y-instance"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + error + '" >' + ErrorIcon + '</button></div>';
                } else if ($el.text().trim().length < 1) {
                  this.warningCount++;
                    error = "<div class='tippy-heading'>Empty heading</div> " +
                        "<p>Even though headings without text aren't visible, they still appear in <a href='https://accessibility.princeton.edu/how/content/headings'>document outlines</a>, " +
                        "and the vertical gaps they create between paragraphs are often larger than the designer intended.</p>" +
                        "<p>To fix: edit the page and delete this line, or change its format from &quot;Heading&quot; to &quot;Normal&quot;.</p>";
                    tippyIcon = '<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-content="' + error + '" >' + WarningIcon + '</button></div>';
                    $el.addClass("sa11y-link-text-warning");
                } else if ($el.text().trim().length > 160) {
                  this.warningCount++;
                  error = "<div class='tippy-heading'>Long <span class='sa11y-bold sa11y-red-text'>(" + headingLength + " character)</span> heading</div> " +
                      "<p>Since <a href='https://accessibility.princeton.edu/how/content/headings'>headings are used as a page outline</a>, they should be brief, clear, informative and unique.</p>";
                  tippyIcon = '<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-content="' + error + '" >' + WarningIcon + '</button></div>';
                }

                prevLevel = level;

                //If the heading error is within a hyperlink, make sure to append button after anchor tag.
                if (error != null && $el.closest("a").length > 0) {
                    $el.addClass(errorLevel ? "sa11y-headings-fail" : "sa11y-link-text-warning");
                    $el.closest('a').after(tippyIcon);
                    var li = "<li class='sa11y-outline-" + level + " sa11y-red-text'><span class='sa11y-bold'><span aria-hidden='true'>&times;</span><span class='sa11y-sr-only'>Error</span> H" + level + ":</span> " + $el.text() + "</li>"; //Generate page outline.
                    $("#sa11y-outline-list").append(li); //Generate page outline.
                }

                // Outline element if there is an error.
                else if (error != null) {
                    $el.addClass(errorLevel ? "sa11y-headings-fail" : "sa11y-link-text-warning");
                    $el.before(tippyIcon);
                    var li = "<li class='sa11y-outline-" + level + " sa11y-red-text'><span class='sa11y-bold'><span aria-hidden='true'>&times;</span><span class='sa11y-sr-only'>Error</span> H" + level + ":</span> " + $el.text() + "</li>"; //Generate page outline.
                    $("#sa11y-outline-list").append(li); //Generate page outline.
                } else if (error == null) {
                    var li = "<li class='sa11y-outline-" + level + "'><span class='sa11y-bold'>H" + level + ":</span> " + $el.text() + "</li>"; //Generate page outline.
                    $("#sa11y-outline-list").append(li); //Generate page outline.
                }

                $("#sa11y-summary-toggle").one("click", function () {
                    // Todo: find out why my code tweaks make this run twice on load.
                    if ($el.find('span').hasClass('sa11y-headings-label') !== true) {
                        $el.append(" <span class='sa11y-headings-label'>H" + level + "</span> ");
                        $('body').addClass('no-stick');
                        $('#header').removeClass('stuck');
                    }
                });

            });
        };

        /*======================== INPUTS MODULE =======================*/
      // todo: test this whole module...
        this.checkLabels = function () {
            if (this.showingLabels) {
                this.showingLabels = false;
            } else {
                this.outlineLabels();
                this.showingLabels = true;
            }
        };

        /* Outlines inaccessible link texts with a red border and a tooltip for remediation solution. */
        this.outlineLabels = function () {
            let $inputs = $(sa11yCheckRoot).find("input");
            $inputs.each((i, el) => {
                let $el = $(el);

                if (!$el.attr('id') && !$el.attr('aria-label') && !$el.attr('aria-labelledby')) {
                    this.errorCount++;
                    $el.addClass("sa11y-error-border");
                    MissingLabelError = "<div class='tippy-heading'>Error</div> There is no label associated with this input. Please add an <kbd>id</kbd> to this input, and add a matching <kbd>for</kbd> attribute to the label."
                    $el.after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + MissingLabelError + '" >' + ErrorIcon + '</button></div>');
                } else if ($el.attr('aria-label')) {
                    /*Optional: add pass border.*/
                } else if ($el.prev().is("label")) {

                    label = $el.prev();
                    if (label.attr('for') == $el.attr('id')) {
                        /*Optional: add pass border.*/
                    } else {
                        this.errorCount++;
                        $el.addClass("sa11y-error-border");
                        NoForAttributeError = "<div class='tippy-heading'>Error</div> There is no label associated with this input. Add a <kbd>for</kbd> attribute to the label that matches the <kbd>id</kbd> of this input. <hr class='tippy-tool-hr' aria-hidden='true'> The ID for this input is: <span class='sa11y-bold'>id=&#34;" + $el.attr('id') + "&#34;</span>"
                        $el.after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + NoForAttributeError + '" >' + ErrorIcon + '</button></div>');
                    }
                }
            });
        };

        /*================== ALTERNATIVE TEXT MODULE ====================*/

        // Toggles the outline of images.
        this.checkAltText = function () {
            if (this.showingAltText) {
                this.clearEverything();
                this.showingAltText = false;
            } else {
                this.outlineAltText();
                this.showingAltText = true;
            }
        };

        this.outlineAltText = function () {

            let $images = $(sa11yCheckRoot).find("img").not(sa11yImageIgnore);
            /* Example: Find all images within the main content area only, and exclude images containing a path.*/

            // Test each image for alternative text.
            $images.each((i, el) => {
                let $el = $(el);

                let text = $el.attr("alt");
                let tippyMessage = "";

                // Checks to see if image contains an alt attribute. If not, then image fails.
                if (text === undefined) {
                    this.errorCount++;

                    // Image fails if it is used as a link and is missing an alt attribute.
                    //if ($el.parent().prop("tagName") == "A") {
                    if ($el.parents().is("a[href]")) {

                        //Image contains both hyperlink
                        if ($el.parents("a").text().trim().length > 1) {
                            $el.addClass("sa11y-error-border");
                            // Todo: edit text when blank alts are available.
                            let missingAltLinkButHasTextError = "<div class='tippy-heading'>Error: missing alt text.</div> All visual elements must <a href='https://accessibility.princeton.edu/how/content/alternative-text'>provide a text alternative</a>."
                            $el.closest("a").addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + missingAltLinkButHasTextError + '" >' + ErrorIcon + '</button></div>');
                        } else if ($el.parents("a").text().trim().length == 0) {
                            $el.addClass("sa11y-error-border");
                            let missingAltLinkError = "<div class='tippy-heading'>Error: image and link have no text</div> All visual elements must <a href='https://accessibility.princeton.edu/how/content/alternative-text'>provide a text alternative</a>. " +
                                "This is critically important when the image's alternative text serves as the link title -- this link will be read by assistive devices as &quot;Link: [awkward silence]&quot;."
                            $el.closest('a').addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + missingAltLinkError + '" >' + ErrorIcon + '</button></div>');
                        }

                    }
                    // General failure message if Image is missing an alt attribute.
                    else {
                        $el.addClass("sa11y-error-border");
                        let generalAltText = "<div class='tippy-heading'>Error: missing alt text.</div> All visual elements must <a href='https://accessibility.princeton.edu/how/content/alternative-text'>provide a text alternative</a>."
                        $el.before('<div class="sa11y-instance"><button type="button" class="sa11y-error-btn" data-tippy-content="' + generalAltText + '" >' + ErrorIcon + '</button></div>');
                    }
                }

                // If alt attribute is present, further tests are done.
                else {
                    let altText = text.replace(/'/g, "&#39;"); //replace apostrophe with HTML ascii to prevent breaking popover.
                    let error = this.containsAltTextStopWords(altText);

                    // Image fails if a url was found.
                    if ($el.parents().is("a[href]")) {
                      if (error[0] !== null) {
                        this.errorCount++;
                        $el.addClass("sa11y-error-border");
                        tippyMessage = "<div class='tippy-heading'>Error: Linked alt contains a filename (&quot;"+error[0]+"&quot;)</div> " +
                            "<p>All visual elements must <a href='https://accessibility.princeton.edu/how/content/alternative-text'>provide a text alternative</a> " +
                            "that describes the meaning of the image in context. </p>" +
                            "<p>In the context of a link, the alt text should create a " +
                            "<a href='https://accessibility.princeton.edu/how/content/links'>clear and meaningful link title</a>.</p>" +
                            "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span></p>";
                        $el.closest('a').addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + tippyMessage + '" >' + ErrorIcon + '</button></div>');
                      } else if (error[1] !== null) {
                        // "image of"
                        this.errorCount++;
                        $el.addClass("sa11y-error-border");
                        tippyMessage = "<div class='tippy-heading'>Error: <span class='sa11y-red-text sa11y-bold'>&quot" + error[1] + "&quot;</span> found in linked image</div> " +
                            "<p>As this image is acting as a link, its alt text should create a <a href='https://accessibility.princeton.edu/how/content/links'>clear and meaningful link title</a> " +
                            "rather than describing the image.</p>" +
                            "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span></p>";

                        $el.closest('a').addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + tippyMessage + '" >' + ErrorIcon + '</button></div>');
                      }
                      else if (text.replace(/'|"|-|\.|\s+/g, "").length === 0) {
                          // Whitespace, empty or meaningless
                          if ($el.parents("a").text().replace(/"|'|\s+/g, "").length === 0) {
                              this.errorCount++;
                              $el.addClass("sa11y-error-border");
                              tippyMessage = "<div class='tippy-heading'>Error: link has no text</div> Please add alt text to this image to create a <a href='https://accessibility.princeton.edu/how/content/links'>clear and meaningful link title</a>"
                              $el.closest('a').addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + tippyMessage + '" >' + ErrorIcon + '</button></div>');
                          }
                      } // Image warning if it is a link and contains long alt text.
                      else if (text.length > 160) {
                          this.warningCount++;
                          $el.addClass("sa11y-warning-border");
                          tippyMessage = "<div class='tippy-heading'>Linked image's alt text is <span class='sa11y-bold'>"+text.length+" characters</span>.</div> " +
                              "<p>The alt text on hyperlinked images should provide a <a href='https://accessibility.princeton.edu/how/content/links'>&quot;concise, clear and meaningful link title&quot;</a>, " +
                              "rather than a description of the image.</p>" +
                              "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span>.</p>";
                          $el.closest('a').addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + tippyMessage + '" >' + ErrorIcon + '</button></div>');
                      }
                      // Image warning if it is a link, contains alt text AND surrounding link text.
                      else if (text !== "" && $el.parents("a").text().trim().length > 1) {
                          this.warningCount++;
                          $el.addClass("sa11y-warning-border");
                          tippyMessage = "<div class='tippy-heading'>Please review (may be OK)</div> " +
                              "<p>This link contains <span class='sa11y-bold'>both</span> text and an image, which will be combined by screen readers to create a single link title. " +
                              "Please make sure the two together still create a " +
                              "<a href='https://accessibility.princeton.edu/how/content/links'>&quot;concise, clear and meaningful link title&quot;</a>.</p>" +
                              "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span></p>"
                          $el.closest('a').addClass('sa11y-exclude').before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-warning-btn" data-tippy-content="' + tippyMessage + '" >' + WarningIcon + '</button></div>');
                      }
                    }
                    // Now if there is no link...
                    else if (error[0] !== null) {
                        this.errorCount++;
                        $el.addClass("sa11y-error-border");
                        tippyMessage = "<div class='tippy-heading'>Error: alt appears to contain a filename</div> " +
                            "<p>All visual elements must <a href='https://accessibility.princeton.edu/how/content/alternative-text'>provide a text alternative</a> " +
                            "that describes the meaning of the image in context.</p>" +
                            "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span></p>"
                        $el.before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + tippyMessage + '" >' + ErrorIcon + '</button></div>');
                      }
                    else if (error[1] !== null) {
                        this.warningCount++;
                        $el.addClass("sa11y-warning-border");
                        tippyMessage = "<p>Since assistive devices announce that they are describing an image, <span class='sa11y-bold'>&quot;" + error[1] + "&quot;</span> is probably redundant in this alt text.</p> " +
                            "<p>Please consider rewriting this alt text to provide a <a href='https://accessibility.princeton.edu/how/content/alternative-text'>concise description of the meaning of the image in context</a>.</p>" +
                            "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span></p>"
                        $el.before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-warning-btn" data-tippy-content="' + tippyMessage + '" >' + WarningIcon + '</button></div>');
                    }
                    // Alert with deadspace alt.
                    else if (text !== "" && text.replace(/"|'|\s+/g, "") === "") {
                        this.errorCount++;
                      $el.addClass("sa11y-error-border");
                      tippyMessage = "<div class='tippy-heading'>Error: invalid alt text</div> " +
                          "<p>Please add alt text to this image to create a " +
                          "<a href='https://accessibility.princeton.edu/how/content/alternative-text'>concise description of the meaning of the image in context</a></p>"
                      $el.before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-btn" data-tippy-content="' + tippyMessage + '" >' + ErrorIcon + '</button></div>');
                    }
                    // Image error if alt text is too long.
                    else if (text.length > 160) {
                        this.warningCount++;
                        $el.addClass("sa11y-warning-border");
                        tippyMessage = "<div class='tippy-heading'>Image's alt text is <span class='sa11y-bold'>"+text.length+" characters</span>.</div> " +
                            "<p>Alt text should provide a <a href='https://accessibility.princeton.edu/how/content/alternative-text'>concise description of the meaning of the image in context</a>." +
                            "<p>If more than 160 characters are needed to describe an image (e.g., for a graph), the long description should be moved into the page's content or onto a separate page.</p>" +
                            "<p class='sa11y-small'>The alt text for this image is: <span class='sa11y-bold'>&quot;" + altText + "&quot;</span>.</p>";
                        $el.before('<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-content="' + tippyMessage + '" >' + WarningIcon + '</button></div>');
                    }

                }



            });
        };

        // Checks if text is not descriptive and returns the word(s) that are making the text inaccessible.
        this.containsAltTextStopWords = function (textContent) {
            let altUrl = [".png", ".jpg", ".jpeg", ".gif"];
            let suspiciousWords = ["image of", "graphic of", "picture of", "placeholder", "photo of"];
            var hit = [null,null];
            $.each(altUrl, function (index, word) {
                if (textContent.toLowerCase().indexOf(word) >= 0) {
                    hit[0] = word;
              }
            })
            $.each(suspiciousWords, function (index, word) {
              if (textContent.toLowerCase().indexOf(word) >= 0) {
                hit[1] = word;
              }
            })
            return hit;
        }


        /*====================== LINK TEXT MODULE =======================*/

        // Toggles the outline of all inaccessible link texts.
        this.checkLinkText = function () {
            if (this.showingLinkText) {
                this.clearEverything();
                this.showingLinkText = false;
            }
            else {
                this.outlineLinkText();
                this.showingLinkText = true;
            }
        };

        this.outlineLinkText = function () {


            let $links = $(sa11yCheckRoot).find ("a").not(sa11yLinkIgnore);

            /* Mini function if you need to exclude any text contained with a span. We created this function to ignore automatically appended sr-only text for external links and document filetypes.

            $.fn.ignore = function(sel){
              return this.clone().find(sel||">*").remove().end();
            };

            Example: If you need to ignore any text within <span class="sr-only">test</span>.
                $el.ignore("span.sr-only").text().trim();

            */
            $.fn.ignore = function(sel){
                return this.clone().find(sel||">*").remove().end();
            };

            $links.each((i, el) => {
                let $el = $(el);
                var linktext = $el.text();
                var linkStrippedText = linktext.replace(/\s+/g, '');
                $el.ignore(sa11yLinkTextIgnore).text().trim();
                //$el.ignore(".block-ps-social").text().trim();
                var hasarialabelledby = $el.attr("aria-labelledby");
                var hasarialabel = $el.attr("aria-label");
                var hasariahidden = $el.attr("aria-hidden");
                var hastabindex = $el.attr("tabindex");

                // error is any words that are making this link text inaccessible.
                var error = this.containsLinkTextStopWords($el.text().trim());

                // Tests to see if this link is empty
                // Todo: doesn't the first check false negative if the link contains an empty span?
                if ($el.children().length === 0 && $el.attr('href') !== undefined && linkStrippedText.length === 0 && $el.is(':visible') && $el.attr('aria-hidden') === undefined && $el.attr('role') !== 'presentation') {
                    this.errorCount++;
                    linkErrorMessage = "<div class='tippy-heading'>Link with no text</div> <p>When links have no accessible text, screen readers either read the entire url, one character at a time, or, worse, they say nothing: <span class='sa11y-bold'>&quot;Link: [awkward silence].&quot;</span></p>" +
                        "<p>To fix: delete this link if it is an empty space due to a copy/paste error, or add some alt text if it is a real link that is wrapped around an image.</p>";
                    $el.addClass("sa11y-link-text-fail");
                    $el.after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + linkErrorMessage + '" >' + ErrorIcon + '</button></div>');
                }
                // if link contains any link text stop words, then it fails.
                else if (error !== null && !hasarialabelledby && !hasarialabel && !hasariahidden && !hastabindex) {
                    this.warningCount++;
                    $el.addClass("sa11y-link-text-warning");
                    if (error === "url") {
                        // Url
                        stopWordMessage = "<p>Please check this link, as it may contain a spelled-out URL. " +
                            "Screen readers will often read this one character at a time. " +
                            "Note that this is <em>fine</em> if the URL <em>is</em> the meaningful information, " +
                            "e.g., when providing an email address or introducing a new website.</p>" +
                            "<p>Related content: <a href='https://accessibility.princeton.edu/how/content/links'>&quot;Link text should be clear and meaningful&quot;</a>.</p>"
                    }
                    else {
                        stopWordMessage = "<p>Please check that this link makes sense out of context, as it contains generic words like &quot;click here&quot; or &quot;download&quot;.</p>" +
                            "<p><a href='https://accessibility.princeton.edu/how/content/links'>Link text should be clear and meaningful</a>, even out of context. " +
                            "Most readers, especially readers relying on assistive devices, first skim pages by headers and link titles.</p>";
                    }
                    $el.after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-link-warning-btn" data-tippy-content="' + stopWordMessage + '" >' + WarningIcon + '</button></div>');
                }
                else {
                }


            });
        };

        // Checks if text is not descriptive and returns the word(s) that are making the text inaccessible.
        // stopWords will flag hyperlinks in link titles.
        // partialStopWords looks for links entirely made of generic words.
        // Note that this was extensively rewritten.
        this.containsLinkTextStopWords = function (textContent) {

            let stopWords = ["http://", "https://", ".asp", ".htm", ".php", ".edu/", ".com/"];
            let partialStopRegex= /learn|to|more|now|this|page|link|site|website|check|out|view|our|read|\.|,|:|download|form|here|click|>|<|\s/g;
            var hit = null;

            // First check for show stoppers.
            $.each(stopWords, function (index, word) {
                if (textContent.toLowerCase().indexOf(word) >= 0) {
                    hit = "url";
                    return false;
                }
            });

            // If no partial words were found, then check for total words.
            if (hit === null) {
                if (textContent.replace(partialStopRegex,'').length === 0) {
                    hit = "generic";
                    return false;
                }
            }
            return hit;
        };






        /*================== QUALITY ASSURANCE MODULE ===================*/

        this.checkQA = function () {
            if (this.showingQA) {
                this.clearEverything();
                this.showingQA = false;
            } else {
                this.outlineQA();
                this.showingQA = true;
            }
        };

        this.outlineQA = function () {


            // Detect paragraphs that should be lists: a. A. a) A) * - -- &bull;
            let $paragraphs = $(sa11yCheckRoot).find("p").not(sa11yListIgnore);
            let prefix = "";
            let prefixDecrement = {
                b: "a",
                B: "A",
                2: "1"
            };
            let prefixMatch = /a\.|a\)|A\.|A\)|1\.|1\)|\*\s|-\s|--|•\s/;
            let activeMatch = "";
            $paragraphs.each(function (i, el) {
                let $el = $(el);
                let previousPrefix = prefix;
                prefix = $el.text().substring(0, 2);
                prefix = prefix.replace(/^b|^B|^2/, function (match) {
                    return prefixDecrement[match];
                });

                // Look for pairs of matched prefixes.
                if (previousPrefix === prefix && prefix.replace(prefixMatch, "").length === 0 && $el.prev().is('p') === true) {
                    // Only flag the first pair in a bulleted list.
                    if (activeMatch !== prefix) {
                        Sa11y.warningCount++;
                        let tippyMessage = "<div class='tippy-heading'>Possible list item prefix: &quot;" +
                            "<span class='sa11y-bold sa11y-red-text'>" + prefix + "</span>&quot;</div>" +
                            "<p><a href='https://accessibility.princeton.edu/how/content/lists'>HTML lists structure content</a> for assistive devices. " +
                            "If this paragraph is starting a list, " +
                            "please use the bullet or number formatting buttons instead " +
                            "of writing out plain text list-like prefixes.</p> ";
                        $el.prev().prepend('<div class="sa11y-instance-inline"><button type="button" class="sa11y-link-warning-btn" data-tippy-content="' + tippyMessage + '" >' + WarningIcon + '</button></div>');
                        activeMatch = prefix;
                    }
                }
                else {
                    activeMatch = "";
                }
            });


            // Warn users of TARGET BLANK within main content.
            let $linksTargetBlank = $(sa11yCheckRoot).find("a[target='_blank']").not("a[href$='.pdf']").not("a[href$='.docx']").not(sa11yLinkIgnore);
            $linksTargetBlank.each((i, el) => {
                let $el = $(el);

                //Do not add warning if they included new tab or new window within link text.
                var checkForNewWindow = ["new tab", "new window"];
                var containsCheckForNewWindow = checkForNewWindow.some(function (pass) {
                    return $el.text().toLowerCase().indexOf(pass) >= 0;
                });

                if ($el && !containsCheckForNewWindow) {
                    this.warningCount++;
                    $el.addClass("sa11y-link-text-warning");
                    WarningNewTab = "<p>Please use <span class='sa11y-bold'>target=&ldquo;_blank&rdquo;</span> sparingly. " +
                        "Forcing links to open in new tabs or windows can be disorienting for people, especially people who have difficulty perceiving visual content.</p> " +
                        "<p>Unless certain <a href='https://www.w3.org/TR/WCAG20-TECHS/G200.html#G200-description'>exceptions related to context-sensitive workflows</a> apply, " +
                        "it is better to let the user decide how they want to open your link.</p>"
                    $el.first().after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-link-warning-btn" data-tippy-content="' + WarningNewTab + '" >' + WarningIcon + '</button></div>');
                }
            });


            //todo: rewrite
            //Warning: Detect uppercase. For each element, if it contains more than 4 uppercase words than indicate warning. Uppercase word is anything that is more than 3 characters.
            $(sa11yCheckRoot).find('h1, h2, h3, h4, h5, h6, p, li:not([class^="sa11y"]), span, blockquote').each(function () {
                var $this = $(this);
                var uppercasePattern = /(?!<a[^>]*?>)([A-Z]{3,})(?![^<]*?<\/a>)/g;
                var detectUpperCase = $this.text().match(uppercasePattern);

                if (detectUpperCase && detectUpperCase.length > 10) {
                    Sa11y.warningCount++;
                    var beforePattern = "<span class='sa11y-uppercase-warning'>";
                    var afterPattern = "</span>"
                    $(this).html($(this).html().replace(uppercasePattern, beforePattern + "$1" + afterPattern));

                    UppercaseWarningMessage = "<div class='tippy-heading'>Warning</div>ALL CAPS DETECTED. It is best practice to avoid typing sentences or phrases in ALL CAPITALS. Lengthy segments of capitalized content is more difficult to read and it may seem like you are SHOUTING. Secondly, some screen readers may interpret all capital text as an acronym. <hr class='tippy-tool-hr' aria-hidden='true'> If this word is an acronym, please ignore this warning. But be sure to also provide the expanded form of the acronym at least once on the page."

                    $this.before('<div class="sa11y-instance"><button type="button" class="sa11y-link-warning-btn" data-tippy-content="' + UppercaseWarningMessage + '" >' + WarningIcon + '</button></div>');
                }
            });


            //Check if a table has a table header.
            let $tablesCheck = $(sa11yCheckRoot).find ("table").not("sa11yTableIgnore");
            $tablesCheck.each((i, el) => {
                let $el = $(el);
                let findTHeaders = $el.find("th");
                let findHeadingTags = $el.find("h1, h2, h3, h4, h5, h6");
                if (findTHeaders.length === 0) {
                    this.errorCount++;
                    $el.addClass("sa11y-error-border");
                    MissingHeadingsError = "<div class='tippy-heading'>Error: table has no headers</div> " +
                        "<p>Assistive device users need <a href='https://accessibility.princeton.edu/how/content/tables'>table headers</a> to be marked on the appropriate row or column (or both). " +
                        "These lets them explore the data directly without having to painstakingly count rows and columns.</p> " +
                        "<p>Note that tables should be used for tabular data only, as they cannot reflow for small screens." +
                        "If this <a href='https://accessibility.princeton.edu/how/content/layout-tables'>table is only for visual layout</a>, use an accessible " +
                        "<a href='https://sitebuilder.princeton.edu/layout-themes/layouts-landing-pages'>multi-column layout</a> to achieve the same affect.</p>"
                    $el.before('<div class="sa11y-instance"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + MissingHeadingsError + '" >' + ErrorIcon + '</button></div>');
                }
                if (findHeadingTags.length > 0) {
                    findHeadingTags.addClass("sa11y-headings-fail");
                    findHeadingTags.parent().addClass("sa11y-error-border");
                    SemanticHeadingTableError = "<div class='tippy-heading'>Error</div> Semantic headings such as Heading 2 or Heading 3 should only be used for sections of content; <span class='sa11y-bold'>not</span> in HTML tables. Indicate table headings using the <span class='sa11y-bold'>th</span> element instead."
                    findHeadingTags.before('<div class="sa11y-instance"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + SemanticHeadingTableError + '" >' + ErrorIcon + '</button></div>');
                }
                //Make sure all table headers are not empty.
                let $thCheck = $(this).find("th");
                $thCheck.each((i, el) => {
                    let $el = $(el);
                    if ($el.text().trim().length < 1) {
                        $el.addClass("sa11y-error-border");
                        EmptyTableHeaderError = "<div class='tippy-heading'>Error: Empty table header found</div>" +
                            "<p>Assistive device users need <a href='https://accessibility.princeton.edu/how/content/tables'>table headers</a> to be marked on the appropriate row or column (or both). " +
                            "These lets them explore the data directly without having to painstakingly count rows and columns.</p>";
                        $el.append('<div class="sa11y-instance"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + EmptyTableHeaderError + '" >' + ErrorIcon + '</button></div>');
                    }
                });
            });

        }


        /*================== FULL CHECK MODULE ===================*/

        this.checkFull = function () {
            if (!this.showingFull) {
                this.outlineFull();
                this.showingFull = true;
            }
        };

        this.outlineFull = function () {

            let mediaCount = 0;

            //todo: rewrite
            //Warning: Find all PDFs. Although only append warning icon to first PDF on page.
            var checkPDF = $("a[href$='.pdf']").not(sa11yFullCheckIgnore);
            let firstPDF = $("a[href$='.pdf']:first");
            if (checkPDF.length > 0) {
                this.warningCount++;
                checkPDF.addClass("sa11y-text-warning");
                checkPDF.has("img").removeClass("sa11y-text-warning");
                WarningPDFMessage = "<div class='tippy-heading'>Warning</div> PDF files are considered web content and must be made accessible as well. If this file is a form, consider using Google Forms as an accessible alternative. If this PDF file is a document, consider converting it into a web page instead. Otherwise, please <span class='sa11y-bold'>check file for accessibility in Acrobat DC.</span>"
                firstPDF.after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-link-warning-btn" data-tippy-lazyloaded="true" data-tippy-content="' + WarningPDFMessage + '" >' + WarningIcon + '</button></div>');
            }

            //Check for blockquotes used as headings. If it's less than 25 characters - it's probably not a quote.
            let $blockquotes = $(sa11yCheckRoot).find("blockquote").not(sa11yFullCheckIgnore);
            $blockquotes.each((i, el) => {
                let $el = $(el);
                if ($el.text().trim().length < 25) {
                    this.errorCount++;
                    $el.addClass("sa11y-error-border")
                    BlockquoteError = "<div class='tippy-heading'>Error</div> Blockquotes should be used for quotes only. They should never be used as headings. Please replace with a semantic heading (e.g. Heading 2 or Heading 3)."
                    $el.before('<div class="sa11y-instance"><button type="button" class="sa11y-error-text-btn" data-tippy-lazyloaded="true" data-tippy-content="' + BlockquoteError + '" >' + ErrorIcon + '</button></div>');
                }
            });

            //Warn users to provide captions for videos.
            let $findVideos = $("video, iframe[src*='youtube.com'], iframe[src*='vimeo.com'], iframe[src*='kaltura.com']").not('[aria-hidden="true"]').not(sa11yFullCheckIgnore);
            $findVideos.each((i, el) => {
                let $el = $(el);
                this.warningCount++;
                mediaCount++;
                $el.addClass("sa11y-warning-border");
                MissingCaptionsWarning = "Please check to make sure <span class='sa11y-bold'>all videos provide closed captioning.</span> Providing captions for all audio and video content is a mandatory Level A requirement. Captions are meant to support people who are D/deaf or hard-of-hearing."
                $el.before('<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-lazyloaded="true" data-tippy-content="' + MissingCaptionsWarning + '" >' + WarningIcon + '</button></div>');
            });

            //Warning: Make sure all podcasts have captions.
            var soundcloudWarning = $('audio, iframe[src*="soundcloud.com"]').not(sa11yFullCheckIgnore);
            if (soundcloudWarning.length > 0) {
                this.warningCount++;
                mediaCount++;
                soundcloudWarning.addClass("sa11y-warning-border");
                SoundCloudMessage = "<div class='tippy-heading'>Warning</div> Please ensure to provide a <span class='sa11y-bold'>transcript for all podcasts.</span> Providing transcripts for audio content is a mandatory Level A requirement. Transcripts are meant to support people who are D/deaf or hard-of-hearing, but can benefit everyone. Consider placing the transcript below or within an accordion panel."
                soundcloudWarning.before('<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-lazyloaded="true" data-tippy-content="' + SoundCloudMessage + '" >' + WarningIcon + '</button></div>');
            }

            //Warning: Check Google Data Studio widget.
            var dataStudioWarning = $('iframe[src*="datastudio.google.com"]').not(sa11yFullCheckIgnore);
            if (dataStudioWarning.length > 0) {
                this.warningCount++;
                dataStudioWarning.addClass("sa11y-warning-border");
                dataStudioWarningMessage = "<div class='tippy-heading'>Error</div> Google Data Studio widgets can be problematic for people who use a keyboard to navigate and people who have difficulty perceiving visual content. Please <span class='sa11y-bold'>provide a text alternative</span> immediately below the Data Studio frame."
                dataStudioWarning.before('<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-lazyloaded="true" data-tippy-content="' + dataStudioWarningMessage + '" >' + WarningIcon + '</button></div>');
            }

            //Warning: Discourage use of Twitter timelines.
            let $twitterWarning = $('[id^=twitter-widget]').not(sa11yFullCheckIgnore);
            $twitterWarning.each((i, el) => {
                let $el = $(el);
                var numberofTweets = $el.contents().find(".timeline-TweetList-tweet").length;
                if (numberofTweets > 3) {
                    this.warningCount++;
                    $el.addClass("sa11y-text-warning");
                    twittererror = "<div class='tippy-heading'>Warning</div> The default Twitter timeline may cause accessibility issues for keyboard users. Secondly, the inline scrolling of the Twitter timeline may cause usability issues for mobile. It's recommended to add the following data attributes to the embed code. <hr aria-hidden='true' class='tippy-tool-hr'><span class='sa11y-bold'>It's recommended to:</span><ul><li>Add <kbd>data-tweet-limit=&#34;2&#34;</kbd> to limit the amount of tweets.</li><li>Add <kbd>data-chrome=&#34;nofooter noheader&#34;</kbd> to remove the widget's header and footer.</li></ul>"
                    $el.before('<div class="sa11y-instance"><button type="button" class="sa11y-link-warning-btn" data-tippy-lazyloaded="true" data-tippy-content="' + twittererror + '" >' + WarningIcon + '</button></div>');
                }
            });



            // Princeton only
            let $socialWarning = $(sa11yCheckRoot).find('.block-ps-social');
            $socialWarning.each((i, el) => {
                let $el = $(el);
                Sa11y.warningCount++;
                tippyMessage = "<p>Note: this tool cannot check embedded " +
                    "content. Please make sure your social media content " +
                    "follows the <a href='https://accessibility.princeton.edu/policy/social-media'>" +
                    "University Social Media Guidelines</a> " +
                    "regarding alt text and captioning.</p>";
                $el.addClass("sa11y-warning-border").before('' +
                    '<div class="sa11y-instance"><button type="button" class="sa11y-warning-btn" data-tippy-lazyloaded="true" data-tippy-content="' + tippyMessage + '" >' + WarningIcon + '</button></div>');
            })
            /* Disabled tests =================



            //todo: rewrite
            /*
            //Error: Find all links pointing to development environment. Customize as needed.
            let $badDevLinks = $(sa11yCheckRoot).find ("a[href^='https://www.dev.'], a[href*='wp-admin']");
            $badDevLinks.each((i, el) => {
                let $el = $(el);
                this.warningCount++;
                $el.addClass("sa11y-link-text-warning");
                BadLinkMessage = "<div class='tippy-heading'>Error</div> Bad link found. Link appears to point to a development environment. Make sure the link does not contain <em>dev</em> or <em>wp-admin</em> in the URL. <hr aria-hidden='true' class='tippy-tool-hr'>This link points to: <br><span class='sa11y-bold sa11y-red-text'>" + el + "</span>"
                $el.after('<div class="sa11y-instance-inline"><button type="button" class="sa11y-link-warning-btn" data-tippy-content="' + BadLinkMessage + '" >' + ErrorIcon + '</button></div>');
            });


            //Error: Check for duplicate IDs.
            var ids = {};
            var found = false;
            $('[id]').each(function () {
                if (this.id && ids[this.id]) {
                    found = true;
                    this.errorCount++;
                    $(this).addClass("sa11y-link-text-fail");
                    duplicateIDMessage = "<div class='tippy-heading'>Error</div> Found <span class='sa11y-bold'>duplicate ID</span>. Duplicate ID errors are known to cause problems for assistive technologies when they are trying to interact with content. <hr aria-hidden='true' class='tippy-tool-hr'>Please remove or change the following ID: <span class='sa11y-bold sa11y-red-text'>" + this.id + "</span>"
                    $(this).before('<div class="sa11y-instance-inline"><button type="button" class="sa11y-error-text-btn" data-tippy-content="' + duplicateIDMessage + '" >' + ErrorIcon + '</button></div>');
                }
                ids[this.id] = 1;
            });

            //Error: Missing language tag. Lang should be at least 2 characters.
            var lang = $("html").attr("lang");
            if ($("html").attr("lang") == undefined || $("html").attr("lang").length < 2) {
                this.errorCount++;
                $('#sa11y-container').after("<div class='sa11y-error-message'>" + ErrorIcon + "<br> Page language not declared! Please <a href='https://www.w3.org/International/questions/qa-html-language-declarations' target='_blank'>declare language on HTML tag.<span class='sa11y-sr-only'>(opens new window)</span></a></div>");
            }

            //Error: Never set user-scalable to 0.
            var userScalable = $("meta").attr("user-scalable");
            if (userScalable == "no" || userScalable == "0" || $("meta[content~='user-scalable=no']").length > 0) {
                this.errorCount++;
                $('#sa11y-container').after("<div class='sa11y-error-message'>" + ErrorIcon + "<br> Remove <span class='sa11y-bold'>user-scalable=&quot;no&quot;</span> paramater from the meta element to allow zooming. This can be very problematic for people with low vision!</div>");
            }

            //Example: A really simply test case to see if a component is used more than once. Delete or change class.
            var checkAnnouncement = $('.announcement-component').length;
            if (checkAnnouncement > 1) {
                this.warningCount++;
                WarningMessageAnnounce = "<div class='tippy-heading'>Warning</div> More than one <strong>Announcement component</strong> found! The Announcement component should be used strategically and sparingly. It should be used to get attention or warn users about something important. Misuse of this component makes it less effective or impactful. This component is semantically labeled as an Announcement for people who use screen readers."
                $('.announcement-component:gt(0)').addClass("sa11y-warning-border");
                $('.announcement-component:gt(0)').before('<div class="sa11y-instance"><button type="button" class="sa11y-link-warning-btn" data-tippy-content="' + WarningMessageAnnounce + '" >' + WarningIcon + '</button></div>');
            }
        }
        */
            

        if (mediaCount > 0) {
            $('#sa11y-image-list').prepend("" +
                "<li>There are <span class='sa11y-red-text'>" + mediaCount + "</span> multimedia elements on this page. " +
                "Please make sure each provides closed captions (for video) or a transcript (for audio).</li>");
        }

        this.updateCount('full');
        this.tippyInit('[data-tippy-lazyloaded]');
        } // End of fullCheck()



        //Add focus state to main toggle button to accommodate custom checkbox button.
        $('input#sa11y-checkbox').on("focus", function () {
            var allyCheckInput = $(this);
            var allyLabelClass = $('.sa11y-main-toggle-style')
            allyLabelClass.addClass('allytogglefocus');
            allyCheckInput.on("blur", function () {
                allyLabelClass.removeClass('allytogglefocus');
                allyCheckInput.off("blur");
            });
        });

    } //End of function sa11y()

});


/*========================== License ============================*/
/* MIT License (MIT)
Copyright (c) 2020 Ryerson University

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

View full license & acknowledgements: https://github.com/ryersondmp/sa11y/blob/master/LICENSE.md */
