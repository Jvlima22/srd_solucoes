<?php
include_once("../conectar.php");
include_once("controllers/motorista_manifesto.php");

$pesquisar_arroba = "SELECT * FROM arroba LIMIT 1";
$resultado_arroba = mysqli_query($conn, $pesquisar_arroba);
$arroba = mysqli_fetch_assoc($resultado_arroba);

$id_motorista = $_SESSION['usuarioIdCliente'];

$pesquisar_entrega = "SELECT 
frete_documento.numero,
frete_documento.id_frete,
frete_documento.id as id_documento,
frete_documento.tipo_acao,
frete.tipo,
frete.numero_cte,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local,
ocorrencia.nome as nome_ocorrencia,
frete.id_motorista
FROM frete_documento
LEFT JOIN ocorrencia ON ocorrencia.id = frete_documento.id_ocorrencia
LEFT JOIN frete ON frete.id = frete_documento.id_frete
LEFT JOIN status_movimento ON status_movimento.id = frete_documento.tipo_acao
LEFT JOIN cadastro local ON local.id = frete.id_local_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
WHERE frete.id_motorista = '$id_motorista' and frete.id_manifesto = 0 and (frete.tipo = 4 or frete.tipo = 13)
group by frete_documento.id
ORDER BY frete_documento.id_frete ASC, frete_documento.numero ASC";
$resultado_entrega = mysqli_query($conn, $pesquisar_entrega);

get_elementMobile('entrega/modal-ocorrencia-lote-entrega.php', ['conn' => $conn]);

get_elementMobile('entrega/modal-ocorrencia-entrega.php', ['conn' => $conn]);
get_elementMobile('entrega/modal-ocorrencia-entrega-detalhe.php', ['conn' => $conn]);
get_elementMobile('entrega/modal-ocorrencia-entrega-excluir.php', ['conn' => $conn]);

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
            <h3><b>Relação de Entrega</b></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <a href="#">
                <button type='button' class='btn btn-cor_02 btnGerarOcorrenciaEntrega'
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
            if (!$resultado_entrega || $resultado_entrega->num_rows <= 0) :
                ?>
                <div class="container-fluid">
                    <div class='alert alert-danger' role='alert'>Nenhum Resultado Disponível !</div>
                </div>
            <?php
            // EXISTE INFORMAÇÃO
            else :
                ?>
                <?php while ($entrega = mysqli_fetch_assoc($resultado_entrega)) {

                ?>
                <div class="col-sm-6 col-md-3">
                    <div class="thumbnail text-center">
                        <div class="col-md-12">
                            <label for="doc_<?php echo $entrega['id_documento']; ?>" class="btn btn-cor_03"
                                   style="width: 500px; float: left; margin-top: +20px; margin-left: 1px;">Selecionar
                                <input
                                        type="checkbox"
                                        class="badgebox"
                                        id="doc_<?php echo $entrega['id_documento']; ?>"
                                        name="doc_<?php echo $entrega['id_documento']; ?>"
                                        data-id_documento="<?php echo $entrega['id_documento']; ?>"
                                        data-numero="<?php echo $entrega['numero']; ?>"
                                        value="1"><span
                                        class="badge marcar_todos marcar">&check;</span></label>
                        </div>
                        <div class="caption text-center">
                            <br>
                            <br>
                            <br>
                            <h5 class="text-left"><b><?php echo 'Documento - ' . $entrega['numero']; ?></b></h5>
                            <h5 class="text-left"><b><?php echo 'Frete - ' . $entrega['id_frete']; ?></b></h5>
                            <?php
                            if ($entrega['numero_cte'] == 0) : ?>
                                <h5 class="text-left"><?php echo 'CTE - ' . 'Sem Informação'; ?></h5>
                            <?php else : ?>
                                <h5 class="text-left"><?php echo 'CTE - ' . $entrega['numero_cte']; ?></h5>
                            <?php endif; ?>
                            <h5 class="text-left"><?php echo mb_strimwidth('Destino - ' . $entrega["nome_local"], 0, 30, "..."); ?></h5>
                            <h5 class="text-left"><?php echo 'Cidade - ' . $entrega['cidade_local']; ?></h5>
                            <h5 class="text-left"><?php echo 'UF - ' . $entrega['uf_local']; ?></h5>
                            <h5 class="text-left"><b><?php echo 'Status - ' . $entrega['nome_status']; ?></b></h5>
                            <h5 class="text-left"><?php echo mb_strimwidth('Ocorrência - ' . $entrega["nome_ocorrencia"], 0, 30, "..."); ?></h5>
                            <br>
                            <p>
                                <button type="button" class="btn btn-cor_03 btnAbrirEntregaDetalhe"
                                        data-numero_documento="<?php echo $entrega['numero']; ?>"
                                        data-id_manifesto="<?php echo $entrega['id_manifesto']; ?>"
                                        data-id_motorista="<?php echo $entrega['id_motorista']; ?>"
                                        data-id_frete="<?php echo $entrega['id_frete']; ?>"
                                        data-id_tipo_movimento="<?php echo $entrega['tipo']; ?>"
                                        data-id_documento_detalhe="<?php echo $entrega['id_documento']; ?>">DETALHE
                                </button>
                            </p>
                            <p>
                                <?php
                                if (($entrega['tipo_acao'] == 1 or $entrega['tipo_acao'] == 4 or $entrega['tipo_acao'] == 6)) : ?>
                                    <button type="button" class="btn btn-cor_02 btnAbrirEntrega"
                                            data-id_manifesto="<?php echo $entrega['id_manifesto']; ?>"
                                            data-id_motorista="<?php echo $entrega['id_motorista']; ?>"
                                            data-id_frete="<?php echo $entrega['id_frete']; ?>"
                                            data-id_tipo_movimento="<?php echo $entrega['tipo']; ?>"
                                            data-numero_documento="<?php echo $entrega['numero']; ?>"
                                            data-id_documento="<?php echo $entrega['id_documento']; ?>">LANÇAR
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
getJsViewMobile('entrega', 'funcoes');
getJsViewMobile('entrega', 'table_entrega');
?>
