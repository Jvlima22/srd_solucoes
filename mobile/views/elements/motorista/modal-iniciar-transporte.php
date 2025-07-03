<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="iniciar_transporte" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     data-backdrop="static">
    <div class="modal-dialog modal-lg" style="width: 400px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title text-center" id="myModalLabel">Iniciar Transporte</h4>
            </div>
            <div class="modal-body">
                <form class="editar_manifesto" method="POST" action="mobile/processa/motorista/processa_editar_manifesto_status_iniciar.php" >
                    <div class="row">
                        <div class="col-md-8">
                            <label >Data Saída:</label>
                            <input type="date" class="form-control" required id="data_saida"
                                   name="data_saida" value="">
                        </div>
                        <div class="col-md-4">
                            <label>Hora Saída:</label>
                            <input type="time" class="form-control" required id="hora_saida"
                                   name="hora_saida" value="">
                        </div>
						</div>
                    </br>
					<input type="hidden" id="id_manifesto" name="id_manifesto"value="">
					<input type="hidden" id="id_motorista" name="id_motorista"value="">
                    <div class="modal-footer">               
                        <button type="submit" class="btn btn-large btn-cor_02 btnManifesto">SALVAR</button>
                        <button type="butto" class="btn btn-cor_03"
                                data-dismiss="modal">VOLTAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

