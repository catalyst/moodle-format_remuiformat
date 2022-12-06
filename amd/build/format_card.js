/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Enhancements to Cards components for easy course accessibility.
 *
 * @module     format/remuiformat
 * @copyright  WisdmLabs
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define([
    'jquery',
    'core/ajax',
    'core/notification',
    'format_remuiformat/common',
    './format_card_ordering'
], function ($, Ajax, Notification, common, ordering) {
    /**
     * Init method
     *
     */
    function init() {

        /**
         * Ajax promises
         * @type {Object}
         */
        var PROMISES = {

            /**
             * Toggle activity view type. Either row or column
             * @param {integer} courseid   Current course id
             * @param {integer} sectionid  Current Section id
             * @param {integer} activityid Selected activity id
             * @return
             */
            SHOW_ACTIVITY_IN_ROW: function(courseid, sectionid, activityid) {
                return Ajax.call([{
                    methodname: "format_remuiformat_show_activity_in_row",
                    args: {
                        courseid: courseid,
                        sectionid: sectionid,
                        activityid: activityid
                    }
                }])[0];
            }
        };

        var cardminHeight = 200;
        $(document).ready(function() {
            if ($('body').is('.editing')) {
                ordering.init();
            }
        });

        // Call AJAX to set activity layout (Row or Card).
        $('.remui-format-card.single-section-format .activity-cards .actions .toggle-row-column').on('click', function() {
            var courseid = $('[data-courseid]').data('courseid');
            var section = $('[data-sectionid]').data('sectionid');
            var activity = $(this).data('activityid');
            var selector = $(this);
            PROMISES.SHOW_ACTIVITY_IN_ROW(courseid, section, activity)
            .done(function(response) {
                if (response.type == 'row') {
                    $(selector).closest('.col-activity').removeClass('col-activity').addClass('row-activity');
                } else {
                    $(selector).closest('.row-activity').addClass('col-activity').removeClass('row-activity');
                }
            })
            .fail(Notification.exception);
        });

        // ... + Show full summary label show conditionally.
        var summaryheight = $('.read-more-target').height();
        if (summaryheight > 110) {
            $('.generalsectioninfo').find('#readmorebtn').removeClass('d-none');
            $('.read-more-target .no-overflow').addClass('text-clamp text-clamp-3').css("-webkit-box-orient", "vertical");;
        }
        $('#readmorebtn').on('click', function () {
            $('.read-more-target .no-overflow').removeClass('text-clamp text-clamp-3');
            $('.generalsectioninfo').find('#readmorebtn').addClass('d-none');
            $('.generalsectioninfo').find('#readlessbtn').removeClass('d-none');
        });
        $('#readlessbtn').on('click', function () {
            $('.read-more-target .no-overflow').addClass('text-clamp text-clamp-3').css("-webkit-box-orient", "vertical");
            $('.generalsectioninfo').find('#readmorebtn').removeClass('d-none');
            $('.generalsectioninfo').find('#readlessbtn').addClass('d-none');
        });
        common.init();
    }
    // Must return the init function.

    return {
        init: init
    };
});