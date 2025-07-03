// FUNÇÃO MARCAR TODOS
function marcardesmarcar() {
	jQuery('.marcar_todos').each(function (index, element) {
		jQuery(element).parent().find('input').attr("checked", false);
		if (!$("#todos").is(':checked')) {
			jQuery(element).parent().find('input').click();
		}
	});
}


// ABRIR MODAL RETIRADA LOTE
$('.btnGerarOcorrenciaRetirada').click((e) => {

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
	$('#lote_retirada').modal('show');
	$("#lote_retirada").find('#id_frete').val(fretes.join(','));
	$("#lote_retirada").find('#frete').val(fretes.join(', '));
	$("#lote_retirada").find('#id_motorista').val($(e.target).data('id_motorista'));
	tableRetirada.ajax.reload();
});

// ABRIR MODAL RETIRADA
$('.btnAbrirRetirada').click((e) => {
	$('#retirada').modal('show');
	$("#retirada").find('#id_manifesto').val($(e.target).data('id_manifesto'));
	$("#retirada").find('#id_motorista').val($(e.target).data('id_motorista'));
	$("#retirada").find('#id_retirada').val($(e.target).data('id_retirada'));
	$("#retirada").find('#retirada').val($(e.target).data('id_retirada'));
	$("#retirada").find('#id_tipo_movimento').val($(e.target).data('id_tipo_movimento'));
	$("#retirada").find('#resultado_frete_retirada').val($(e.target).data('id_frete'));
	$("#retirada").find('#id_frete').val($(e.target).data('id_frete'));
	$("#retirada").find('#id_tipo_movimento').val($(e.target).data('id_tipo_movimento'));
	tableRetirada.ajax.reload();
});

// ABRIR MODAL RETIRADA
$('.btnAbrirRetiradaDetalhe').click((e) => {
	$('#retirada_detalhe').modal('show');
	$("#retirada_detalhe").find('#id_manifesto').val($(e.target).data('id_manifesto'));
	$("#retirada_detalhe").find('#id_motorista').val($(e.target).data('id_motorista'));
	$("#retirada_detalhe").find('#id_retirada_detalhe').val($(e.target).data('id_retirada'));
	$("#retirada_detalhe").find('#id_retirada').val($(e.target).data('id_retirada'));
	$("#retirada_detalhe").find('#retirada').val($(e.target).data('id_retirada'));
	$("#retirada_detalhe").find('#id_tipo_movimento').val($(e.target).data('id_tipo_movimento'));
	$("#retirada_detalhe").find('#resultado_frete_retirada').val($(e.target).data('id_frete'));
	$("#retirada_detalhe").find('#id_frete_retirada').val($(e.target).data('id_frete'));
	tableRetirada.ajax.reload();

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
				toastr.success("Manifesto: " + data.retorno, 'Sucesso!', {timeOut: 3000});
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
