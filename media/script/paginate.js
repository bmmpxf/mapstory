var loading = "<div class='loading'><p>Loading more items&hellip;</p></div>";

$(function () {
    $(".paginate").each(function() {
        var paginate = $(this),
            auto = paginate.hasClass("paginate-auto") ? true : false,
        hasMore = parseInt(paginate.find(".pagination .current.page").html()) < parseInt(paginate.find(".pagination .page_total").html()),
        pages = paginate.find(".pagination");
        pages.children().hide();
        if (auto || !hasMore) {
            pages.hide();
        }
        if (hasMore && !$("html.ie8").size()) {
            if (auto) {
                paginate.find(".paginate-contents").scroll(function(ev) {
                    var el = $(this),
                    scroll = el.scrollTop(),
                    view = el.innerHeight(),
                    bottom = this.scrollHeight,
                    more;
                    if (scroll + view == bottom) {
                        more = pages.find("a.more");
                        if (more.length) {
                            fetchMore(more);
                        }
                    }
                });
            } else {
                pages.prepend($("<a></a>", {
                    href: pages.find("a.more").attr("href"),
                    html: "<i class=\"icon-chevron-down\"></i> Show more",
                    "class": "more"
                    }
                ).click(function(e) {
                    e.preventDefault();
                    fetchMore(this);
                }));
            }

        }
    });
});

function fetchMore(a, cb) {
    var link = $(a),
        pager = link.parents(".paginate"),
        sel = pager.attr('data-page-select');
    $.ajax({
        url: link.attr('href') ,
        context: link.parents(".paginate"),
        success: function(data, status, jqxhr) {
            var retval = $(data),
                elements = retval.find(sel),
                more = retval.find("a.next").attr("href"),
                container = $(this);
            container.find(".paginate-contents").append(elements).trigger("paginate.loaded", [elements]);
            container.find(".loading").detach();
            if (more) {
                container.find('.more').attr("href", more);
            } else {
                container.find('.more').remove();
            }
            if (cb) {
                cb(elements);
            }
        }
    });
}
