const prefixCls = "chanho";

const getBaseCls = (suffix: string) => {
  return `${prefixCls}-${suffix}`;
};

// Accordion Component
export const accordionBaseCls = getBaseCls("accordion");
export const accordionItemCls = getBaseCls("accordion-item");
export const accordionTriggerCls = getBaseCls("accordion-trigger");
export const accordionContentCls = getBaseCls("accordion-content");

// Calendar Component
export const calendarBaseCls = getBaseCls("calendar");
export const calendarBodyCls = getBaseCls("calendar-body");
export const calendarCurrentCls = getBaseCls("calendar-current");
export const calendarNavigatorCls = getBaseCls("calendar-navigator");

// Carousel Component
export const carouselBaseCls = getBaseCls("carousel");
export const carouselItemListCls = getBaseCls("carousel-item-list");
export const carouselItemCls = getBaseCls("carousel-item");
export const carouselNavigatorCls = getBaseCls("carousel-navigator");
export const carouselIndicatorCls = getBaseCls("carousel-indicator");

// CarouselXscroll Component
export const carouselXscrollBaseCls = getBaseCls("carouselXscroll");
export const carouselXscrollItemContainerCls = getBaseCls(
  "carouselXscroll-item-container"
);
export const carouselXscrollItemsCls = getBaseCls("carouselXscroll-items");
export const carouselXscrollNavigatorCls = getBaseCls(
  "carouselXscroll-navigator"
);

// DatePicker Component
export const datePickerBaseCls = getBaseCls("datePicker");

// Modal Component
export const modalBaseCls = getBaseCls("modal");
export const modalBackdropCls = getBaseCls("modal-backdrop");
export const modalTriggerCls = getBaseCls("modal-trigger");
export const modalContentCls = getBaseCls("modal-content");
export const modalCloseCls = getBaseCls("modal-close");

// Pagination Component
export const paginationBaseCls = getBaseCls("pagination");
export const paginationButtonsCls = getBaseCls("pagination-buttons");
export const paginationNavigatorCls = getBaseCls("pagination-navigator");

// Popover Component
export const popoverBaseCls = getBaseCls("popover");
export const popoverTriggerCls = getBaseCls("popover-trigger");
export const popoverContentCls = getBaseCls("popover-content");

// SelectPicker Component
export const selectBaseCls = getBaseCls("select");
export const selectContentCls = getBaseCls("select-content");
export const selectItemCls = getBaseCls("select-item");
export const selectTirggerCls = getBaseCls("select-trigger");

// Tabs Component
export const tabsBaseCls = getBaseCls("tabs");
export const tabsMenuListBaseCls = getBaseCls("tabs-menu-list");
export const tabsMenuBaseCls = getBaseCls("tabs-menu");
export const tabsPannelBaseCls = getBaseCls("tabs-pannel");

// Toast Component
export const toastBaseCls = getBaseCls("toast");
export const toastContentCls = getBaseCls("toast-content");
export const toastTitleCls = getBaseCls("toast-title");
export const toastDescriptionCls = getBaseCls("toast-description");
