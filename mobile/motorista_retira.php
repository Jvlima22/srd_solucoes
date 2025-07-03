<?php
include_once("../conectar.php");
include_once("controllers/motorista_manifesto.php");

$pesquisar_arroba = "SELECT * FROM arroba LIMIT 1";
$resultado_arroba = mysqli_query($conn, $pesquisar_arroba);
$arroba = mysqli_fetch_assoc($resultado_arroba);

$id_motorista = $_SESSION['usuarioIdCliente'];

$pesquisar_retirada = "SELECT 
frete.id as id_frete,
frete.tipo,
frete.numero_cte,
retirada.id as id_retirada,
retirada.id_motorista,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local
FROM frete
LEFT JOIN retirada_movimento ON retirada_movimento.id_frete = frete.id 
LEFT JOIN retirada ON retirada.id = retirada_movimento.id_retirada
LEFT JOIN status_movimento ON status_movimento.id = retirada.status
LEFT JOIN cadastro local ON local.id = retirada.id_unidade_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
WHERE retirada.id_motorista = '$id_motorista' and retirada.id_manifesto = 0 and retirada.status != 10
ORDER BY frete.id ASC";
$resultado_retirada = mysqli_query($conn, $pesquisar_retirada);

get_elementMobile('retirada/modal-ocorrencia-lote-retirada.php', ['conn' => $conn]);
get_elementMobile('retirada/modal-ocorrencia-retirada.php', ['conn' => $conn]);
get_elementMobile('retirada/modal-ocorrencia-retirada-detalhe.php', ['conn' => $conn]);
get_elementMobile('retirada/modal-ocorrencia-retirada-excluir.php', ['conn' => $conn]);

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
            <h3><b>Relação de Retirada</b></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <a href="#">
                <button type='button' class='btn btn-cor_02 btnGerarOcorrenciaRetirada'
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
            if (!$resultado_retirada || $resultado_retirada->num_rows <= 0) :
                ?>
                <div class="container-fluid">
                    <div class='alert alert-danger' role='alert'>Nenhum Resultado Disponível !</div>
                </div>
            <?php
            // EXISTE INFORMAÇÃO
            else :
                ?>
                <?php while ($retirada = mysqli_fetch_assoc($resultado_retirada)) {

                ?>
                <div class="col-sm-6 col-md-3">
                    <div class="thumbnail text-center">
                        <div class="col-md-12">
                            <label for="doc_<?php echo $retirada['id_frete']; ?>" class="btn btn-cor_03"
                                   style="width: 500px; float: left; margin-top: +20px; margin-left: 1px;">Selecionar
                                <input
                                        type="checkbox"
                                        class="badgebox"
                                        id="doc_<?php echo $retirada['id_frete']; ?>"
                                        name="doc_<?php echo $retirada['id_frete']; ?>"
                                        data-id_frete="<?php echo $retirada['id_frete']; ?>"
                                        value="1"><span
                                        class="badge marcar_todos marcar">&check;</span></label>
                        </div>
                        <div class="caption text-center">
                            <br>
                            <br>
                            <br>
                            <h5 class="text-left"><b><?php echo 'Frete - ' . $retirada['id_frete']; ?></b></h5>
                            <h5 class="text-left"><b><?php echo 'Retirada - ' . $retirada['id_retirada']; ?></b></h5>
                            <?php
                            if ($retirada['numero_cte'] == 0) : ?>
                                <h5 class="text-left"><?php echo 'CTE - ' . 'Sem Informação'; ?></h5>
                            <?php else : ?>
                                <h5 class="text-left"><?php echo 'CTE - ' . $retirada['numero_cte']; ?></h5>
                            <?php endif; ?>
                            <h5 class="text-left"><?php echo mb_strimwidth('Destino - ' . $retirada["nome_local"], 0, 30, "..."); ?></h5>
                            <h5 class="text-left"><?php echo 'Cidade - ' . $retirada['cidade_local']; ?></h5>
                            <h5 class="text-left"><?php echo 'UF - ' . $retirada['uf_local']; ?></h5>
                            <h5 class="text-left"><b><?php echo 'Status - ' . $retirada['nome_status']; ?></b></h5>
                            <br>
                            <p>
                                <button type="button" class="btn btn-cor_03 btnAbrirretiradaDetalhe"
                                        data-id_manifesto="<?php echo $retirada['id_manifesto']; ?>"
                                        data-id_retirada="<?php echo $retirada['id_retirada']; ?>"
                                        data-id_motorista="<?php echo $retirada['id_motorista']; ?>"
                                        data-id_frete="<?php echo $retirada['id_frete']; ?>"
                                        data-id_tipo_movimento="<?php echo $retirada['tipo']; ?>">DETALHE
                                </button>
                            </p>
                            <p>
                                <?php
                                if (($retirada['status'] != 8)) : ?>
                                    <button type="button" class="btn btn-cor_02 btnAbrirretirada"
                                            data-id_manifesto="<?php echo $retirada['id_manifesto']; ?>"
                                            data-id_retirada="<?php echo $retirada['id_retirada']; ?>"
                                            data-id_motorista="<?php echo $retirada['id_motorista']; ?>"
                                            data-id_frete="<?php echo $retirada['id_frete']; ?>"
                                            data-id_tipo_movimento="<?php echo $retirada['tipo']; ?>">LANÇAR
                                        OCORRÊNCIA
                                    </button>
                                <?php endif; ?>
                            </p>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <?php endif; ?>
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
getJsViewMobile('motorista', 'funcoes');
getJsViewMobile('motorista', 'table_retirada');


?>
