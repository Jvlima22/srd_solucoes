<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="coleta_excluir" tabindex="-1" role="dialog"
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
					  action="mobile/processa/coleta/processa_excluir_ocorrencia_coleta.php">
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
								   id="documentos"
								   value="">
						</div>
						<div class="col-md-4">
							<label>Coleta:</label>
							<input type="text" class="form-control" disabled
								   id="id_Coleta"
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
					<input type="text" id="id_motorista" name="id_motorista" value="">
                    <input type="text" id="id" name="id_ocorrencia_movimento" value="">
					<input type="text" id="id_tipo_movimento" name="id_tipo_movimento" value="">
					<input type="text" id="id_ocorrencia" name="id_ocorrencia" value="">
					<input type="text" id="informar_recebedor" name="informar_recebedor" value="">
                    <input type="text" id="comprovante" name="comprovante" value="">
					<input type="text" id="id_coleta" name="id_coleta" value="">
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
