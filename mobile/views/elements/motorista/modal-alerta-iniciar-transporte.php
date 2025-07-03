<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="alerta_iniciar_transporte" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     data-backdrop="static">
    <div class="modal-dialog modal-lg" style="width: 400px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title text-center" id="myModalLabel">ATENÇÃO</h4>
            </div>
            <div class="modal-body">
                <form class="editar_manifesto" method="POST"
                      action="mobile/processa/motorista/processa_editar_manifesto_status_iniciar.php">
                    <div class="row">
                        <div class="col-md-12">
                            <label><h4 class="text-danger">Inicie o Transporte para poder Realizar as Baixas.</h4>
                            </label>
                        </div>
                    </div>
                    </br>
                    <div class="modal-footer">
                        <button type="butto" class="btn btn-cor_03"
                                data-dismiss="modal">VOLTAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

