<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="entrega_excluir" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel"">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
						aria-label="Close"><span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title text-center" id="myModalLabel">Excluir Ocorrência</h4>
			</div>
			<div class="modal-body">
				<form class="excluir_modal" method="POST"
					  action="mobile/processa/motorista/processa_excluir_ocorrencia_entrega.php">
					<div class="row">
						<div class="col-md-4">
							<label>Nº Ocorrência:</label>
							<input type="text" class="form-control" disabled
								   id="id_ocorrencia"
								   value="">
						</div>
						<div class="col-md-4">
							<label>Documento:</label>
							<input type="text" class="form-control" disabled
								   id="numero_documento"
								   value="">
						</div>
						<div class="col-md-4">
							<label>Frete:</label>
							<input type="text" class="form-control" disabled
								   id="id_frete"
								   value="">
						</div>
						<div class="col-md-12">
							<label>Ocorrência:</label>
							<input type="text" class="form-control" disabled
								   id="nome_ocorrencia"
								   value="">
						</div>
						<div class="col-md-6">
							<label>Data Ocorrência:</label>
							<input type="date" style="min-width:96%;" class="form-control" disabled
								   id="data_ocorrencia"
								   value="">
						</div>
						<div class="col-md-6">
							<label>Hora Ocorrência:</label>
							<input type="time" style="min-width:96%;" class="form-control" disabled
								   id="hora_ocorrencia"
								   value="">
						</div>
					</div>
					<br>
					<input type="hidden" id="id_manifesto" name="id_manifesto" value="">
                    <input type="hidden" id="id_motorista" name="id_motorista" value="">
					<input type="hidden" id="id" name="id_ocorrencia_movimento" value="">
					<input type="hidden" id="id_tipo_movimento" name="id_tipo_movimento" value="">
					<input type="hidden" id="id_ocorrencia" name="id_ocorrencia" value="">
					<input type="hidden" id="informar_recebedor" name="informar_recebedor" value="">
                    <input type="hidden" id="comprovante" name="comprovante" value="">
					<input type="hidden" id="id_frete" name="id_frete" value="">
					<input type="hidden" id="id_documento" name="id_documento" value="">
					<div class="modal-footer">
						<button type="butto" class="btn btn-large btn-cor_02 btnExcluir">SIM</button>
						<button type="butto" class="btn btn-cor_03"
								data-dismiss="modal">NÃO
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
