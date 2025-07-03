<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="despacho" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel"">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" onclick="javascript:window.location.reload()"
						aria-label="Close"><span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title text-center" id="myModalLabel">Lançar Ocorrência</h4>
			</div>
			<div class="modal-body">
				<form class="editar_modal" method="POST"
					  action="mobile/processa/motorista/processa_gravar_ocorrencia_despacho.php">
					<div class="row">
						<div class="col-md-6">
							<label>Minuta de Despacho:</label>
							<input type="text" class="form-control" disabled
								   id="despacho"
								   value="">
						</div>
						<div class="col-md-6">
							<label>Frete:</label>
							<input type="text" class="form-control" disabled
								   id="resultado_frete_despacho"
								   value="">
						</div>
					</div>
					<br>
                    <div class="row">
                        <div class="col-md-12 text-left">
                            <label>Ocorrência:</label>
                            <input type="hidden" id="id_ocorrencia" name="id_ocorrencia"
                                   value=""
                                   idselect="pesquisar_ocorrencia">
                            <input type="hidden" id="informar_recebedor" name="informar_recebedor"
                                   value=""
                                   recebedorselect="pesquisar_ocorrencia">
                            <input type="hidden" id="comprovante" name="comprovante"
                                   value=""
                                   comprovanteselect="pesquisar_ocorrencia">
                            <input type="hidden" id="tipo_acao" name="tipo_acao"
                                   value=""
                                   tipoacaoselect="pesquisar_ocorrencia">
                            <select class="form-control ajustaIdSelect select-ocorrencia" required
                                    id="pesquisar_ocorrencia">
                                <option value="">...</option>
                                <?php
                                $pesquisar_ocorrencia = "SELECT 
								ocorrencia.id,
								ocorrencia.nome,
								ocorrencia.informar_recebedor,
								ocorrencia.comprovante,
								ocorrencia.tipo_acao,
								status_movimento.nome as nome_cao							
								FROM ocorrencia 
								LEFT JOIN status_movimento ON status_movimento.id = ocorrencia.tipo_acao
								WHERE ocorrencia.tipo = 17 and ocorrencia.motorista = 1 and ocorrencia.status = 1 ORDER BY ocorrencia.nome ASC";
                                $resultado_ocorrencia = mysqli_query($conn, $pesquisar_ocorrencia);
                                while ($listar_ocorrencia = mysqli_fetch_assoc($resultado_ocorrencia)) { ?>
                                    <option value="<?php echo $listar_ocorrencia['nome']; ?>"
                                            idoption="<?= $listar_ocorrencia['id']; ?>"
                                            idoptionRecebedor="<?= $listar_ocorrencia['informar_recebedor']; ?>"
                                            idoptionComprovante="<?= $listar_ocorrencia['comprovante']; ?>"
                                            idoptionTipoacao="<?= $listar_ocorrencia['tipo_acao']; ?>"
                                    ><?php echo $listar_ocorrencia['nome']; ?></option> <?php
                                }
                                ?>
                            </select>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-12 text-left">
                            <label>Data Ocorrência:</label>
                            <input type="date" style="min-width:96%;" class="form-control" required id="data_ocorrencia"
                                   name="data_ocorrencia"
                                   value="">
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-12 text-left">
                            <label>Hora Ocorrência:</label>
                            <input type="time" style="min-width:96%;" class="form-control" required id="hora_ocorrencia"
                                   name="hora_ocorrencia"
                                   value="">
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-12 text-left">
                            <label>Observação:</label>
                            <input type="text" class="form-control" id="observacao"
                                   name="observacao"
                                   value="">
                        </div>
                    </div>
                    <br>
                    <div class="row oculta-campo">
                        <div class="col-md-12 text-left">
                            <label>Recebedor:</label>
                            <input type="text" class="form-control" name="recebedor"
                                   value="" id="recebedor">
                        </div>
                        <div class="col-md-12 text-left">
                            <label>Documento:</label>
                            <input type="text" class="form-control" name="documento_recebedor"
                                   value="" id="documento_recebedor">
                        </div>
                        <div class="col-md-12 text-left">
                            <label>Tipo de Recebedor:</label>
                            <input type="hidden" id="id_tipo_recebedor" name="id_tipo_recebedor"
                                   value=""
                                   idselect="pesquisar_tipo_recebedor">
                            <select class="form-control ajustaIdSelect" id="pesquisar_tipo_recebedor">
                                <option value="">...</option>
                                <?php
                                $pesquisar_tipo_recebedor = "SELECT tipo_recebedor.* FROM tipo_recebedor WHERE id > 0 ORDER BY tipo_recebedor.nome ASC";
                                $resultado_tipo_recebedor = mysqli_query($conn, $pesquisar_tipo_recebedor);
                                while ($listar_tipo_recebedor = mysqli_fetch_assoc($resultado_tipo_recebedor)) { ?>
                                    <option value="<?php echo $listar_tipo_recebedor['nome']; ?>"
                                            idoption="<?= $listar_tipo_recebedor['id']; ?>"
                                    ><?php echo $listar_tipo_recebedor['nome']; ?></option> <?php
                                }
                                ?>
                            </select>
                        </div>
                    </div>
                    <div class="row oculta-campo-comprovante">
                        <div class="col-md-12">
                            <div class="images"></div>
                            <br>
                            <input type="file" name="files[]" id="files" onchange="preview(this);" multiple>
                        </div>
                    </div>
                    <br>
					<input type="hidden" id="id_frete" name="id_frete" value="">
                    <input type="hidden" id="id_manifesto" name="id_manifesto" value="">
                    <input type="hidden" id="id_motorista" name="id_motorista" value="">
					<input type="hidden" id="id_despacho" name="id_despacho" value="">
					<input type="hidden" id="id_tipo_movimento" name="id_tipo_movimento" value="">
					<div class="modal-footer">
						<button type="butto" class="btn btn-large btn-cor_02 btnEditar">SALVAR</button>
						<button type="butto" class="btn btn-cor_03"
								data-dismiss="modal">VOLTAR
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

