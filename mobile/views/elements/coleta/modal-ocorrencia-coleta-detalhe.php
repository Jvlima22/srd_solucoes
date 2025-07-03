<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="coleta_detalhe" tabindex="-1" role="dialog"
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
					<div class="col-md-12">
						<label>Numero da Coleta:</label>
						<input type="text" class="form-control" disabled
							   id="coleta"
							   value="">
					</div>
				</div>
				<br>
				<div class="row">
                </div>
					<table style="font-size: 12px" id="table-coleta"
						   class="table table-striped table-bordered table-hover tablesorter">
					</table>
                </div>
				<br>
				<input type="hidden" id="id_coleta_detalhe" name="id_documento" value="">
				<div class="modal-footer">
					<button type="butto" class="btn btn-cor_03"
							data-dismiss="modal">VOLTAR
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

