<!-- Inicio Modal Cadastrar -->
<div class="modal fade" id="retirada_detalhe" tabindex="-1" role="dialog"
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
                    <label>Romaneio de Retirada:</label>
                    <input type="text" class="form-control" disabled
                           id="retirada"
                           value="">
                </div>
                <div class="col-md-6">
                    <label>Frete:</label>
                    <input type="text" class="form-control" disabled
                           id="resultado_frete_retirada"
                           value="">
                </div>
            </div>
            <br>
            <table style="font-size: 12px" id="table-retirada"
                   class="table table-striped table-bordered table-hover tablesorter">
            </table>
        </div>
        <br>
        <input type="text" id="id_frete_retirada" name="id_frete" value="">
        <input type="text" id="id_manifesto" name="id_manifesto" value="">
        <input type="text" id="id_retirada" name="id_minuta" value="">
        <input type="text" id="id_tipo_movimento" name="id_tipo_movimento" value="">
        <input type="text" id="id_retirada_detalhe" name="id_retirada" value="">
        <div class="modal-footer">
            <button type="butto" class="btn btn-cor_03"
                    data-dismiss="modal">VOLTAR
            </button>
        </div>
    </div>
</div>
</div>
</div>

