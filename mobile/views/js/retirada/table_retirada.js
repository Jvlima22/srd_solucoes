//FUNÇÃO TABLE
var listaSelecionada = [];
var selecionar = false;

var tableRetirada = $("#table-retirada").DataTable({
    "ajax": {
        url: 'mobile/table/retirada/table_retirada.php',
        type: "POST",
        data: {
            action: 'listar',
            id: function () {
                return $("#id").val();
            },
            id_frete: function () {
                return $("#id_frete_retirada").val();
            }
        }, error: function (response) {

        }
    },
    "lengthMenu": [[25, 50, 100], [25, 50, 100]],
    "processing": true,
    "serverSide": true,
    "searching": false,
    "ordering": false,
    "paging": false,
    "info": false,
    "pageLength": 50,
    "lengthChange": false,
    "language": {
        "decimal": "",
        "emptyTable": "Nenhum dado disponível",
        "info": "Mostrando _START_ de _END_ ate _TOTAL_ registros",
        "infoEmpty": "Mostrando 0 de 0 ate 0 registros",
        "infoFiltered": "(Filtrado de _MAX_ registros)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrando _MENU_ registros",
        "loadingRecords": "Carregando...",
        "processing": "Buscando...",
        "search": "Busca:",
        "zeroRecords": "Nenhum registro encontrado",
        "paginate": {
            "first": "Primeiro",
            "last": "Último",
            "next": "Próximo",
            "previous": "Anterior"
        },
        "aria": {
            "sortAscending": ": Ascendente",
            "sortDescending": ": Descendente"
        }
    },
    "order": [
        [2, 'desc'],
        [3, 'asc']
    ],
    columns: [
        {
            title: "Documento",
            data: 'numero',
            name: 'numero',
            searchable: false,
		}, {
            title: "Ocorrência",
            data: 'nome_ocorrencia',
            name: 'nome_ocorrencia',
            searchable: false,
        }, {
            title: "Data",
            data: 'data_ocorrencia',
            name: 'data_ocorrencia',
            width: 20,
        }, {
            title: "Hora",
            data: 'hora_ocorrencia',
            name: 'hora_ocorrencia',
            width: 15,
            searchable: false,
        },
        {
            title: "Excluir",
            orderable: false,
            data: 'id',
            className: 'text-center',
            width: 20,
            render: function (data, type, row, meta) {
                var buttons = '';
                if (row.id_ocorrencia > 5) {
                    var dados = btoa(JSON.stringify(row));
                    buttons += `<a href="#" data-data="${dados}" data-toggle="modal" data-target="#retirada_excluir"><span class="glyphicon glyphicon-trash text-danger"></span></a>`;
                }
                return buttons;
            }
        }
    ],
    fnDrawCallback: function (oSettings) {
        setTimeout(function () {
            tableRetirada.columns.adjust();
            $('#table-retirada').css('width', '100%');
        }, 100);
    }
});

$('#btnPesquisar').click(() => {
    tableRetirada.ajax.reload();
});

$("#retirada_excluir").on("shown.bs.modal", function (e) {
    var data = JSON.parse(atob($(e.relatedTarget).data('data')));
    $.ajax({
        url: 'mobile/table/retirada/table_retirada.php', type: "POST", dataType: "json", data: {
            action: 'detalhe', id: data.id
        }, success: function (data) {
            $("#retirada_excluir").find('#id').val(data.data.id);
            $("#retirada_excluir").find('#id_ocorrencia').val(data.data.id_ocorrencia);
            $("#retirada_excluir").find('#id_tipo_movimento').val(data.data.id_tipo_movimento);
            $("#retirada_excluir").find('#numero_documento').val(data.data.numero_documento);
            $("#retirada_excluir").find('#nome_ocorrencia').val(data.data.nome_ocorrencia);
            $("#retirada_excluir").find('#data_ocorrencia').val(data.data.data_ocorrencia);
            $("#retirada_excluir").find('#hora_ocorrencia').val(data.data.hora_ocorrencia);
            $("#retirada_excluir").find('#id_motorista').val(data.data.id_motorista);
            $("#retirada_excluir").find('#informar_recebedor').val(data.data.informar_recebedor);
            $("#retirada_excluir").find('#id_documento').val(data.data.id_documento);
            $("#retirada_excluir").find('#documentosaaa').val(data.data.documentos);
            $("#retirada_excluir").find('#id_retirada').val(data.data.id_retirada);
            $("#retirada_excluir").find('#id_manifesto').val(data.data.id_manifesto);
            $("#retirada_excluir").find('#id_frete').val(data.data.id_frete);


        }
    });
});
