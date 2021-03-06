$(function () {
    var api = new GhostContentAPI({
        url: ADVISORY.SITE_URL,
        key: ADVISORY.CONTENT_API_KEY,
        version: "v4",
    });

    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    function renderCard(post) {
        var splitTitle = post.title.split(":"); // <!> This assumes all event titles contain a colon
        var splitDate = post.custom_excerpt.split("-");
        // prettier-ignore
        var html =
            '<article class="border-2 border-gray-400 rounded-xl p-2.5 event-card">\
                <div class="grid grid-cols-2">\
                    <div>\
                        <p class="text-yellow-500 font-semibold text-3xl event-date-day">' + splitDate[2] + '</p>\
                        <p class="text-yellow-500 text-xl event-date-month">' + monthNames[parseInt(splitDate[1]) - 1] + '</p>\
                    </div>\
                    <div>\
                        <p class="text-3xl text-gray-500 text-right">➔</p>\
                    </div>\
                </div>\
                \
                <div class="my-2.5">\
                    <p class="text-gray-600 font-semibold text-3xl py-0.5">' + splitTitle[0] + ':</p>\
                    <p class="text-gray-600 font-semibold text-xl">' + splitTitle[1] + '</p>\
                </div>\
            </article>';
        return html;
    }

    function renderContainer(posts) {
        if (posts.length > 0) {
            var html =
                '<div class="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-16 w-4/5 m-auto break-words">';
            posts.slice(0, 4).forEach(function (post) {
                html += renderCard(post);
            });
            html += "</div>";
            $("#event-card-container").html(html);
        } else {
            $("#event-card-placeholder").html("No upcoming events.");
        }
    }

    // Constructing date string for the current day
    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = today.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var date = today.getFullYear() + "-" + month + "-" + day;

    // Fetching event posts from API
    var filterQuery = "tag:hash-event+custom_excerpt:>='" + date + "'";
    api.posts
        .browse({
            include: "tags",
            filter: filterQuery,
            order: "custom_excerpt ASC",
        })
        .then(function (posts) {
            renderContainer(posts);
        })
        .catch(function (err) {
            console.error(err);
        });
});
