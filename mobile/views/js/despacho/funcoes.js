// FUNÇÃO MARCAR TODOS
function marcardesmarcar() {
	jQuery('.marcar_todos').each(function (index, element) {
		jQuery(element).parent().find('input').attr("checked", false);
		if (!$("#todos").is(':checked')) {
			jQuery(element).parent().find('input').click();
		}
	});
}

// ABRIR MODAL DESPACHO LOTE
$('.btnGerarOcorrenciaDespacho').click((e) => {

	var fretes = [];
	jQuery('.marcar_todos').each(function (index, element) {
		if (jQuery(element).parent().find('input').is(':checked')) {
			fretes.push(jQuery(element).parent().find('input').data('id_frete'));
		}
	});
	if (fretes.length == 0) {
		exibirModalAlerta('idMarcar');
		return;
	}
	$('#lote_despacho').modal('show');
	$("#lote_despacho").find('#id_frete').val(fretes.join(','));
	$("#lote_despacho").find('#frete').val(fretes.join(', '));
	$("#lote_despacho").find('#id_motorista').val($(e.target).data('id_motorista'));
	tableDespacho.ajax.reload();
});


// ABRIR MODAL DESPACHO
$('.btnAbrirDespacho').click((e) => {
	$('#despacho').modal('show');
	$("#despacho").find('#id_manifesto').val($(e.target).data('id_manifesto'));
	$("#despacho").find('#id_motorista').val($(e.target).data('id_motorista'));
	$("#despacho").find('#id_despacho').val($(e.target).data('id_despacho'));
	$("#despacho").find('#despacho').val($(e.target).data('id_despacho'));
	$("#despacho").find('#id_tipo_movimento').val($(e.target).data('id_tipo_movimento'));
	$("#despacho").find('#resultado_frete_despacho').val($(e.target).data('id_frete'));
	$("#despacho").find('#id_frete').val($(e.target).data('id_frete'));
	$("#despacho").find('#id_tipo_movimento').val($(e.target).data('id_tipo_movimento'));
	tableDespacho.ajax.reload();
});

// ABRIR MODAL DESPACHO DETALHE
$('.btnAbrirDespachoDetalhe').click((e) => {
	$('#despacho_detalhe').modal('show');
	$("#despacho_detalhe").find('#id_manifesto').val($(e.target).data('id_manifesto'));
	$("#despacho_detalhe").find('#id_motorista').val($(e.target).data('id_motorista'));
	$("#despacho_detalhe").find('#id_despacho_detalhe').val($(e.target).data('id_despacho'));
	$("#despacho_detalhe").find('#id_despacho').val($(e.target).data('id_despacho'));
	$("#despacho_detalhe").find('#despacho').val($(e.target).data('id_despacho'));
	$("#despacho_detalhe").find('#id_tipo_movimento').val($(e.target).data('id_tipo_movimento'));
	$("#despacho_detalhe").find('#resultado_frete_despacho').val($(e.target).data('id_frete'));
	$("#despacho_detalhe").find('#id_frete_minuta').val($(e.target).data('id_frete'));
	tableDespacho.ajax.reload();

});


// EDITAR MANIFESTO
$('.editar_manifesto').submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var form_url = form.attr('action');
	var form_btn = $(".btnManifesto");

	// Create an FormData object
	var data = new FormData(form[0]);

	$.ajax({
		url: form_url,
		type: 'post',
		data: data,
		dataType: "json",
		processData: false,  // Important!
		contentType: false,
		cache: false,
		beforeSend: function () {
			form_btn.html('Processando...');
			form_btn.attr('disabled', true);
		},
		success: function (data) {
			form_btn.html('SALVAR');
			form_btn.attr('disabled', false);

			// var alert = $('.alert');

			if (data.error == 0) {
				// alert('Salvo com sucesso!');
				// alert.show();
				// alert.removeClass('alert-danger').addClass('alert-success');
				// alert.find('strong').html('Sucesso!');
				// alert.find('p').html("Cadastro: " + data.retorno);
				toastr.success("Frete: " + data.retorno, 'Sucesso!', {timeOut: 3000});
				setTimeout(() => {
					window.location.href = data.url
				}, 500);


			} else {
				// alert.show();
				// alert.removeClass('alert-success').addClass('alert-danger');
				// alert.find('strong').html('Erro!');
				// alert.find('p').html("Cadastro: " + data.retorno);

				toastr.error("Frete: " + data.retorno, 'Atenção!', {timeOut: 3000});
			}
		}
	});

});

// EDITAR MODAL
$('.editar_modal').submit(function (e) {
    e.preventDefault();

    var form = $(this);
    var form_url = form.attr('action');
    var form_btn = $(".btnEditar");

    // Create an FormData object
    var data = new FormData(form[0]);

    $.ajax({
        url: form_url,
        type: 'post',
        data: data,
        dataType: "json",
        processData: false,  // Important!
        contentType: false,
        cache: false,
        beforeSend: function () {
            form_btn.html('Processando...');
            form_btn.attr('disabled', true);
        },
        success: function (data) {
            form_btn.html('SALVAR');
            form_btn.attr('disabled', false);

            // var alert = $('.alert');

            if (data.error == 0) {
                // alert('Salvo com sucesso!');
                // alert.show();
                // alert.removeClass('alert-danger').addClass('alert-success');
                // alert.find('strong').html('Sucesso!');
                // alert.find('p').html("Cadastro: " + data.retorno);
                toastr.success("Frete: " + data.retorno, 'Sucesso!', {timeOut: 3000});
				setTimeout(() => {
                    window.location.href = data.url
                }, 500);


            } else {
                // alert.show();
                // alert.removeClass('alert-success').addClass('alert-danger');
                // alert.find('strong').html('Erro!');
                // alert.find('p').html("Cadastro: " + data.retorno);

                toastr.error("Frete: " + data.retorno, 'Atenção!', {timeOut: 3000});
            }
        }
    });

});

// EXCLUIR MODAL
$('.excluir_modal').submit(function (e) {
	e.preventDefault();

	var form = $(this);
	var form_url = form.attr('action');
	var form_btn = $(".btnExcluir");

	// Create an FormData object
	var data = new FormData(form[0]);

	$.ajax({
		url: form_url,
		type: 'post',
		data: data,
		dataType: "json",
		processData: false,  // Important!
		contentType: false,
		cache: false,
		beforeSend: function () {
			form_btn.html('Processando...');
			form_btn.attr('disabled', true);
		},
		success: function (data) {
			form_btn.html('SIM');
			form_btn.attr('disabled', false);

			// var alert = $('.alert');

			if (data.error == 0) {
				// alert('Salvo com sucesso!');
				// alert.show();
				// alert.removeClass('alert-danger').addClass('alert-success');
				// alert.find('strong').html('Sucesso!');
				// alert.find('p').html("Cadastro: " + data.retorno);
				toastr.success("Frete: " + data.retorno, 'Sucesso!', {timeOut: 3000});
				setTimeout(() => {
					window.location.href = data.url
				}, 500);


			} else {
				// alert.show();
				// alert.removeClass('alert-success').addClass('alert-danger');
				// alert.find('strong').html('Erro!');
				// alert.find('p').html("Cadastro: " + data.retorno);

				toastr.error("Frete: " + data.retorno, 'Atenção!', {timeOut: 3000});
			}
		}
	});

});


// OCUTAR CAMPO RECEBEDOR ENTREGA
jQuery(document).ready(function () {
	jQuery('.oculta-campo').hide();

	jQuery('.select-ocorrencia').change(function () {
		var modal = $(this).closest('.modal');

		var opt = $('option[value="' + $(this).val() + '"]');
		var id_select = jQuery(this).attr('id');

		var row = modal.find('#' + id_select).closest('.modal').find('.oculta-campo');
		if (opt.attr('idoptionRecebedor') == '1') {
			row.show();
			row.find("#recebedor").attr('required', true);
			row.find("#documento_recebedor").attr('required', true);
			row.find("#pesquisar_tipo_recebedor").attr('required', true);
		} else {
			row.hide();
			row.find("#recebedor").removeAttr('required');
			row.find("#pesquisar_tipo_recebedor").removeAttr('required');
		}
		jQuery('#' + id_select).parent().find('.idoptionRecebedor').val(jQuery('#' + id_select + 'option:selected').attr('idoptionRecebedor'));
	});
});


// OCUTAR CAMPO COMPROVANTE ENTREGA
jQuery(document).ready(function () {
	jQuery('.oculta-campo-comprovante').hide();

	jQuery('.select-ocorrencia').change(function () {

		var modal = $(this).closest('.modal');

		var opt = $('option[value="' + $(this).val() + '"]');
		var id_select = jQuery(this).attr('id');

		var row = modal.find('#' + id_select).closest('.modal').find('.oculta-campo-comprovante');

		if (opt.attr('idoptionComprovante') == '1') {
			row.show();
			row.find("#files").attr('required', true);
		} else {
			row.hide();
			row.find("#files").removeAttr('required');
		}
		jQuery('#' + id_select).parent().find('.idoptionComprovante').val(jQuery('#' + id_select + 'option:selected').attr('idoptionComprovante'));
	});
});
