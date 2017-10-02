$('#all_organizations').each(function() {
  var t = $(this);
  t.dataTable({
    order: [[4, 'desc']],
    serverSide: true,
    lengthChange: false,
    ajax: {
      url: t.data('url'),
      type: 'POST'
    },
    columns: [
      {data: 'logo', orderable: false},
      {data: 'name'},
      {data: 'created'},
      {data: 'description', orderable: false},
      {data: 'member_count'},
      {data: 'legate_count'},
      {data: 'button', orderable: false}
    ]
  })
});

