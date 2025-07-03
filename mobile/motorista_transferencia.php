<?php
include_once("../conectar.php");
include_once("controllers/motorista_manifesto.php");

$pesquisar_arroba = "SELECT * FROM arroba LIMIT 1";
$resultado_arroba = mysqli_query($conn, $pesquisar_arroba);
$arroba = mysqli_fetch_assoc($resultado_arroba);

$id_motorista = $_SESSION['usuarioIdCliente'];

$pesquisar_transferencia = "SELECT 
frete.id as id_frete,
frete.tipo,
frete.numero_cte,
transferencia.id as id_transferencia,
transferencia.id_motorista,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local
FROM frete
LEFT JOIN transferencia_movimento ON transferencia_movimento.id_frete = frete.id 
LEFT JOIN transferencia ON transferencia.id = transferencia_movimento.id_transferencia
LEFT JOIN status_movimento ON status_movimento.id = transferencia.status
LEFT JOIN cadastro local ON local.id = transferencia.id_unidade_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
WHERE transferencia.id_motorista = '$id_motorista' and transferencia.id_manifesto = 0 and transferencia.status != 10
ORDER BY frete.id ASC";
$resultado_transferencia = mysqli_query($conn, $pesquisar_transferencia);

get_elementMobile('transferencia/modal-ocorrencia-lote-transferencia.php', ['conn' => $conn]);
get_elementMobile('transferencia/modal-ocorrencia-transferencia.php', ['conn' => $conn]);
get_elementMobile('transferencia/modal-ocorrencia-transferencia-detalhe.php', ['conn' => $conn]);
get_elementMobile('transferencia/modal-ocorrencia-transferencia-excluir.php', ['conn' => $conn]);

getCssView('geral', 'css-geral');
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Página Inicial">
    <meta name="author" content="SRP Soluções">
    <link rel="icon" href="favicon.ico">
    <title>SRP - APP MOTORISTA</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.21/datatables.min.css"/>
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.21/datatables.min.js"></script>
    <link type="text/css"
          href="//gyrocode.github.io/jquery-datatables-checkboxes/1.2.12/css/dataTables.checkboxes.css"
          rel="stylesheet"/>
    <script type="text/javascript"
            src="//gyrocode.github.io/jquery-datatables-checkboxes/1.2.12/js/dataTables.checkboxes.min.js"></script>
<body>
<div class="container theme-showcase" role="main">
    <div class="row">
        <div class="col-md-6">
            <h3><b>Relação de Transferência</b></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <a href="#">
                <button type='button' class='btn btn-cor_02 btnGerarOcorrenciaTransferencia'
                        data-id_motorista="<?php echo $id_motorista; ?>"
                        style="width: 370px; float: left; margin-top: +20px; margin-left: 1px;">
                    GERAR OCORRÊNCIA EM LOTE
                </button>
            </a>
        </div>
    </div>
    <label for="todos" class="btn btn-cor_03"
           style="width: 370px; float: left; margin-top: +20px; margin-left: 1px;">Marcar Todos
        <input
                type="checkbox"
                class="badgebox"
                id="todos"
                name="todos"
                value="1"><span
                class="badge todos" onclick="marcardesmarcar();">&check;</span></label>
</div>
<div class="container theme-showcase" role="main">

</div>
</div>
<br>
<div class="form-group">
    <div class="container marketing">
        <div class="row">
            <?php
            // NÃO POSSUI INFORMAÇÃO
            if (!$resultado_transferencia || $resultado_transferencia->num_rows <= 0) :
                ?>
                <div class="container-fluid">
                    <div class='alert alert-danger' role='alert'>Nenhum Resultado Disponível !</div>
                </div>
            <?php
            // EXISTE INFORMAÇÃO
            else :
                ?>
                <?php while ($transferencia = mysqli_fetch_assoc($resultado_transferencia)) {

                ?>
                <div class="col-sm-6 col-md-3">
                    <div class="thumbnail text-center">
                        <div class="col-md-12">
                            <label for="doc_<?php echo $transferencia['id_frete']; ?>" class="btn btn-cor_03"
                                   style="width: 500px; float: left; margin-top: +20px; margin-left: 1px;">Selecionar
                                <input
                                        type="checkbox"
                                        class="badgebox"
                                        id="doc_<?php echo $transferencia['id_frete']; ?>"
                                        name="doc_<?php echo $transferencia['id_frete']; ?>"
                                        data-id_frete="<?php echo $transferencia['id_frete']; ?>"
                                        value="1"><span
                                        class="badge marcar_todos marcar">&check;</span></label>
                        </div>
                        <div class="caption text-center">
                            <br>
                            <br>
                            <br>
                            <h5 class="text-left"><b><?php echo 'Frete - ' . $transferencia['id_frete']; ?></b></h5>
                            <h5 class="text-left">
                                <b><?php echo 'Transferência - ' . $transferencia['id_transferencia']; ?></b></h5>
                            <?php
                            if ($transferencia['numero_cte'] == 0) : ?>
                                <h5 class="text-left"><?php echo 'CTE - ' . 'Sem Informação'; ?></h5>
                            <?php else : ?>
                                <h5 class="text-left"><?php echo 'CTE - ' . $transferencia['numero_cte']; ?></h5>
                            <?php endif; ?>
                            <h5 class="text-left"><?php echo mb_strimwidth('Destino - ' . $transferencia["nome_local"], 0, 30, "..."); ?></h5>
                            <h5 class="text-left"><?php echo 'Cidade - ' . $transferencia['cidade_local']; ?></h5>
                            <h5 class="text-left"><?php echo 'UF - ' . $transferencia['uf_local']; ?></h5>
                            <h5 class="text-left"><b><?php echo 'Status - ' . $transferencia['nome_status']; ?></b></h5>
                            <br>
                            <p>
                                <button type="button" class="btn btn-cor_03 btnAbrirtransferenciaDetalhe"
                                        data-id_manifesto="<?php echo $transferencia['id_manifesto']; ?>"
                                        data-id_transferencia="<?php echo $transferencia['id_transferencia']; ?>"
                                        data-id_motorista="<?php echo $transferencia['id_motorista']; ?>"
                                        data-id_frete="<?php echo $transferencia['id_frete']; ?>"
                                        data-id_tipo_movimento="<?php echo $transferencia['tipo']; ?>">DETALHE
                                </button>
                            </p>
                            <p>
                                <?php
                                if (($transferencia['status'] != 8)) : ?>
                                    <button type="button" class="btn btn-cor_02 btnAbrirtransferencia"
                                            data-id_manifesto="<?php echo $transferencia['id_manifesto']; ?>"
                                            data-id_transferencia="<?php echo $transferencia['id_transferencia']; ?>"
                                            data-id_motorista="<?php echo $transferencia['id_motorista']; ?>"
                                            data-id_frete="<?php echo $transferencia['id_frete']; ?>"
                                            data-id_tipo_movimento="<?php echo $transferencia['tipo']; ?>">LANÇAR
                                        OCORRÊNCIA
                                    </button>
                                <?php endif; ?>
                            </p>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <?php endif; ?>
        </div>
        <div class="modal-footer">
        </div>
    </div>
</div>
</div>
<div class="container theme-showcase" role="main">
    <div class="page-header">
        <p><?php echo $arroba['nome']; ?></p>
    </div> <!-- /container -->
</div>
<br>
<br>
</body>
</html>
<?php
getJsView('geral', 'funcoes');
getJsViewMobile('transferencia', 'funcoes');
getJsViewMobile('transferencia', 'table_transferencia');


?>
