'use strict';

import core from 'metal';
import dom from 'metal-dom';
import templates from './Pagination.soy';
import Component from 'metal-component';
import Soy from 'metal-soy';

class Pagination extends Component  {
	constructor(value) {
		super(value);

		this.TOTAL_CONTROLS = 2;

		/**
		 * 
		 * @type {Object}
		 * @default {page: this.page}
		 */
		this.lastState = {
			page: this.page
		};

		this.on(Pagination.Events.CHANGE_REQUEST, this.defaultChangeRequestFn_, true);
	}

	/**
	 * Default `changeRequest` function, sets new state of pagination.
	 * @param {EventFacade} event
	 * @protected
	 */
	defaultChangeRequestFn_(event) {
		this.setState_(event.state);
	}

	/**
	 * Fires `changeRequest` event.
	 * @method _dispatchRequest
	 * @param {Object} state
	 * @protected
	 */
	dispatchRequest_(state) {
		this.emit(
			Pagination.Events.CHANGE_REQUEST,
			{
				lastState: this.lastState,
				offset: this.offset,
				state: state,
				total: this.total
			}
		);
	}

	/**
	 * Retrieve page number including offset e.g., if offset is 100 and
	 * active page is 5, this method returns 105.
	 * @return {number} current page number plus offset
	 */
	getOffsetPageNumber() {
		return this.offset + this.page;
	}

	/**
	 * Retrieve total number of pages including offset e.g., if offset is
	 * 100 and total 10, this method returns 110.
	 * @return {number} total page number plus offset
	 */
	getOffsetTotalPages() {
		return this.offset + this.total;
	}

	/**
	* Navigate to the next page.
	*/
	next() {
		var total = this.total;

		if (total === 0) {
			return;
		}

		var page = this.page;

		this.dispatchRequest_({
			page: (this.circular && (page === total - 1)) ? 0 : Math.min(total, ++page)
		});
	}

	/**
	 * `onClick` handler for pagination items.
	 * @param {EventFacade} event
	 */
	onClickItem(event) {
		var item = event.delegateTarget;

		event.preventDefault();

		if (dom.hasClass(item, 'active')) {
			return;
		}

		var index = parseInt(item.getAttribute('data-index'));

		this.dispatchRequest_({
			page: index
		});
	}

	/**
	 * `onClick` handler for pagination items.
	 * @param {EventFacade} event
	 */
	onClickControls(event) {
		var control = event.delegateTarget;

		event.preventDefault();

		if (dom.hasClass(control, 'disabled')) {
			return;
		}

		var index = parseInt(control.getAttribute('data-control-index'));

		switch (index) {
			case 0:
				this.prev();
				break;
			case 1:
				this.next();
				break;
		}
	}

	/**
	 * Navigate to the previous page.
	 */
	prev() {
		var total = this.total;

		if (total === 0) {
			return;
		}

		var page = this.page;

		this.dispatchRequest_({
			page: (this.circular && (page === 0)) ? total - 1 : Math.max(0, --page)
		});
	}

	/**
	 * Set the new pagination state. The state is a payload object
	 * containing the page number, e.g. `{page:1}`.
	 * @param {Object} state
	 * @return {Object}
	 * @protected
	 */
	setState_(state) {
		this.page = state.page;

		this.lastState = state;
	}
}

Soy.register(Pagination, templates);

Pagination.STATE = {
	/**
	 * When enabled this property allows the navigation to go back to
	 * the beggining when it reaches the last page, the opposite behavior
	 * is also true. Incremental page navigation could happen clicking the
	 * control arrows or invoking <code>.next()</code> and
	 * <code>.prev()</code> methods.
	 * @type {boolean}
	 * @default true
	 */
	circular: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 * Initial page offset.
	 * @type {number}
	 * @default 1
	 */
	offset: {
		validator: core.isNumber,
		value: 1
	},

	/**
	 * Page to display on initial paint.
	 * @type {number}
	 * @default 0
	 */
	page: {
		validator: core.isNumber,
		value: 0
	},

	/**
	 * @type {boolean}
	 * @default true
	 */
	showControls: {
		validator: core.isBoolean,
		value: true
	},

	/**
	 * @type {Object}
	 * @default {next: 'Next', prev: 'Prev'}
	 */
	strings: {
		validator: core.isObject,
		value: {
			next: 'Next',
			prev: 'Prev'
		}
	},

	/**
	 * Total number of page links available. If set, the new
	 * <a href="Pagination.html#config_items">items</a> node list will
	 * be rendered.
	 * @type {number}
	 * @default 0
	 */
	total: {
		validator: core.isNumber,
		value: 0
	}
};

Pagination.Events = {
	CHANGE_REQUEST: 'changeRequest'
};

export default Pagination;
