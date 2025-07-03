<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="entrega_detalhe" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel"">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
						aria-label="Close"><span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title text-center" id="myModalLabel">Ocorrências</h4>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-md-6">
						<label>Documento / NF:</label>
						<input type="text" class="form-control" disabled
							   id="numero_documento"
							   value="">
					</div>
					<div class="col-md-6">
						<label>Frete:</label>
						<input type="text" class="form-control" disabled
							   id="frete"
							   value="">
					</div>
				</div>
				<br>
				<div class="row">
					<table style="font-size: 12px" id="table-entrega"
						   class="table table-striped table-bordered table-hover tablesorter">
					</table>
				</div>
				<br>
                <input type="hidden" id="id_motorista" name="id_motorista" value="">
				<input type="hidden" id="id_frete" name="id_frete" value="">
				<input type="hidden" id="id_tipo_movimento" name="id_tipo_movimento" value="">
				<input type="hidden" id="id_documento_detalhe" name="id_documento" value="">
				<div class="modal-footer">
					<button type="butto" class="btn btn-cor_03"
							data-dismiss="modal">VOLTAR
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

