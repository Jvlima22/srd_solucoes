<?php
include_once("../conectar.php");
include_once("controllers/motorista_manifesto.php");

$pesquisar_arroba = "SELECT * FROM arroba LIMIT 1";
$resultado_arroba = mysqli_query($conn, $pesquisar_arroba);
$arroba = mysqli_fetch_assoc($resultado_arroba);

$id_motorista_manifesto     = $_SESSION['usuarioIdCliente'];
$manifesto_entrega          = $_GET['entrega'];
$manifesto_coleta           = $_GET['coleta'];
$manifesto_despacho         = $_GET['despacho'];
$manifesto_retirada         = $_GET['retirada'];
$manifesto_transferencia    = $_GET['transferencia'];

$pesquisar_entrega = "SELECT 
frete_documento.numero,
frete_documento.id_frete,
frete_documento.id as id_documento,
frete_documento.tipo_acao,
manifesto_movimento.id_manifesto,
frete.tipo,
frete.numero_cte,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local,
ocorrencia.nome as nome_ocorrencia,
manifesto.id_motorista,
manifesto.id as id_manifesto
FROM frete_documento
LEFT JOIN ocorrencia ON ocorrencia.id = frete_documento.id_ocorrencia
LEFT JOIN frete ON frete.id = frete_documento.id_frete
LEFT JOIN status_movimento ON status_movimento.id = frete_documento.tipo_acao
LEFT JOIN cadastro local ON local.id = frete.id_local_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete.id 
LEFT JOIN manifesto ON manifesto.id = manifesto_movimento.id_manifesto
WHERE manifesto_movimento.id_manifesto = '$manifesto_entrega' and manifesto_movimento.id_tipo_movimento = 4
group by frete_documento.id
ORDER BY frete_documento.id_frete ASC, frete_documento.numero ASC";
$resultado_entrega = mysqli_query($conn, $pesquisar_entrega);

$pesquisar_coleta = "SELECT 
coleta.id,
coleta.id_motorista,
coleta.tipo,
coleta.volume,
coleta.peso,
coleta.status,
coleta_trecho.id_manifesto,
status_movimento.nome as nome_status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local
FROM coleta
LEFT JOIN coleta_trecho ON coleta_trecho.id_coleta = coleta.id
LEFT JOIN status_movimento ON status_movimento.id = coleta.status
LEFT JOIN cadastro local ON local.id = coleta.id_local_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
WHERE coleta_trecho.id_manifesto = '$manifesto_coleta'
group by coleta.id
ORDER BY coleta.id DESC";
$resultado_coleta = mysqli_query($conn, $pesquisar_coleta);

$pesquisar_despacho = "SELECT 
frete.id as id_frete,
frete.tipo,
frete.numero_cte,
manifesto_movimento.id_manifesto,
despacho.id as id_despacho,
despacho.id_motorista,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local,
manifesto.id as id_manifesto
FROM frete
LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete.id 
LEFT JOIN minuta despacho ON despacho.id = manifesto_movimento.id_minuta
LEFT JOIN status_movimento ON status_movimento.id = despacho.status
LEFT JOIN cadastro local ON local.id = despacho.id_local_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
LEFT JOIN manifesto ON manifesto.id = manifesto_movimento.id_manifesto
WHERE manifesto_movimento.id_manifesto = '$manifesto_despacho' and manifesto_movimento.id_tipo_movimento = 6
ORDER BY despacho.id ASC, frete.id ASC";
$resultado_despacho = mysqli_query($conn, $pesquisar_despacho);

$pesquisar_retirada = "SELECT 
frete.id as id_frete,
frete.tipo,
frete.numero_cte,
manifesto_movimento.id_manifesto,
retirada.id as id_retirada,
retirada.id_motorista,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local,
manifesto.id as id_manifesto
FROM frete
LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete.id 
LEFT JOIN retirada ON retirada.id = manifesto_movimento.id_minuta
LEFT JOIN status_movimento ON status_movimento.id = retirada.status
LEFT JOIN cadastro local ON local.id = retirada.id_unidade_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
LEFT JOIN manifesto ON manifesto.id = manifesto_movimento.id_manifesto
WHERE manifesto_movimento.id_manifesto = '$manifesto_retirada' and manifesto_movimento.id_tipo_movimento = 14
ORDER BY retirada.id ASC, frete.id ASC";
$resultado_retirada = mysqli_query($conn, $pesquisar_retirada);


$pesquisar_transferencia = "SELECT 
frete.id as id_frete,
frete.tipo,
frete.numero_cte,
manifesto_movimento.id_manifesto,
transferencia.id as id_transferencia,
transferencia.id_motorista,
status_movimento.nome as nome_status,
status_movimento.id as status,
local.nome_fantasia as nome_local,
local.cnpj as cnpj_local,
cidade_local.cidade as cidade_local,
cidade_local.uf as uf_local,
manifesto.id as id_manifesto
FROM frete
LEFT JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete.id 
LEFT JOIN transferencia ON transferencia.id = manifesto_movimento.id_minuta
LEFT JOIN status_movimento ON status_movimento.id = transferencia.status
LEFT JOIN cadastro local ON local.id = transferencia.id_unidade_destino
LEFT JOIN cidade_atendida cidade_local ON cidade_local.ibge = local.ibge
LEFT JOIN manifesto ON manifesto.id = manifesto_movimento.id_manifesto
WHERE manifesto_movimento.id_manifesto = '$manifesto_transferencia' and manifesto_movimento.id_tipo_movimento = 15
ORDER BY transferencia.id ASC, frete.id ASC";
$resultado_transferencia = mysqli_query($conn, $pesquisar_transferencia);

get_elementMobile('motorista/modal-ocorrencia-lote-entrega.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-lote-despacho.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-lote-retirada.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-lote-transferencia.php', ['conn' => $conn]);

get_elementMobile('motorista/modal-ocorrencia-entrega.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-entrega-detalhe.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-entrega-excluir.php', ['conn' => $conn]);

get_elementMobile('motorista/modal-ocorrencia-coleta.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-coleta-detalhe.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-coleta-excluir.php', ['conn' => $conn]);

get_elementMobile('motorista/modal-ocorrencia-despacho.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-despacho-detalhe.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-despacho-excluir.php', ['conn' => $conn]);

get_elementMobile('motorista/modal-ocorrencia-retirada.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-retirada-detalhe.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-retirada-excluir.php', ['conn' => $conn]);

get_elementMobile('motorista/modal-ocorrencia-transferencia.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-transferencia-detalhe.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-ocorrencia-transferencia-excluir.php', ['conn' => $conn]);

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
<?php
if ($manifesto_entrega > 0) : ?>
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
                        data-id_manifesto="<?php echo $manifesto_entrega; ?>"
                        data-id_motorista="<?php echo $id_motorista_manifesto; ?>"
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
        <?php endif; ?>
        <?php
        if ($manifesto_coleta > 0) : ?>
        <div class="container theme-showcase" role="main">
            <div class="row">
                <div class="col-md-6">
                    <h3><b>Relação de Coleta</b></h3>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="container marketing">
                <div class="row">
                    <?php
                    // NÃO POSSUI INFORMAÇÃO
                    if (!$resultado_coleta || $resultado_coleta->num_rows <= 0) :
                        ?>
                        <div class="container-fluid">
                            <div class='alert alert-danger' role='alert'>Nenhum Resultado Disponível !</div>
                        </div>
                    <?php
                    // EXISTE INFORMAÇÃO
                    else :
                        ?>
                        <?php while ($coleta = mysqli_fetch_assoc($resultado_coleta)) {

                        $pesquisar_coleta = "SELECT 
						coleta_documento.id 
						FROM coleta_documento
						WHERE coleta_documento.id_coleta = '" . $coleta['id'] . "' ";
                        $listar_coleta = mysqli_query($conn, $pesquisar_coleta);
                        $totalDocumento = mysqli_num_rows($listar_coleta);

                        $pesquisar_documento = getArrayByQuery('SELECT * FROM coleta_documento WHERE id_coleta = "' . $coleta['id'] . '"', $conn);
                        $resultado_documento = '';

                        foreach ($pesquisar_documento as $dado_minuta) {
                            $resultado_documento .= $dado_minuta['numero'] . ', ';
                        }
                        if (strlen($resultado_documento) > 1) {
                            $resultado_documento = substr($resultado_documento, 0, -1);
                        }

                        ?>
                        <div class="col-sm-6 col-md-3">
                            <div class="thumbnail text-center">
                                <br>
                                <button class="btn btn-cor_03" type="button">
                                    Coleta N° <span class="badge"><?php echo $coleta['id']; ?></span>
                                </button>
                                <div class="caption text-center">
                                    <h5 class="text-left"><b><?php echo 'Total Documento - ' . $totalDocumento; ?></b>
                                    </h5>
                                    <h5 class="text-left"><b><?php echo 'Volume - ' . $coleta['volume']; ?></b>
                                    </h5>
                                    <h5 class="text-left">
                                        <b><?php echo 'Peso - ' . number_format($coleta['peso'], 3, ",", ""); ?></b>
                                    </h5>
                                    <h5 class="text-left"><?php echo mb_strimwidth('Local - ' . $coleta["nome_local"], 0, 30, "..."); ?></h5>
                                    <h5 class="text-left"><?php echo 'Cidade - ' . $coleta['cidade_local']; ?></h5>
                                    <h5 class="text-left"><?php echo 'UF - ' . $coleta['uf_local']; ?></h5>
                                    <h5 class="text-left"><b><?php echo 'Status - ' . $coleta['nome_status']; ?></b>
                                    </h5>
                                    <br>
                                    <p>
                                        <button type="button" class="btn btn-cor_03 btnAbrirColetaDetalhe"
                                                data-totalDocumento="<?php echo $totalDocumento; ?>"
                                                data-id_coleta="<?php echo $coleta['id']; ?>"
                                                data-id_motorista="<?php echo $coleta['id_motorista']; ?>"
                                                data-id_manifesto="<?php echo $coleta['id_manifesto']; ?>"
                                                data-id_tipo_movimento="<?php echo $coleta['tipo']; ?>"
                                                data-nome_local="<?php echo $coleta['nome_local']; ?>">DETALHE
                                        </button>
                                    </p>
                                    <p>
                                        <?php
                                        if (($coleta['status'] == 1 or $coleta['status'] == 4 or $coleta['status'] == 6)) : ?>
                                            <button type="button" class="btn btn-cor_02 btnAbrirColeta"
                                                    data-id_coleta="<?php echo $coleta['id']; ?>"
                                                    data-resultado_documento="<?php echo $resultado_documento; ?>"
                                                    data-id_motorista="<?php echo $coleta['id_motorista']; ?>"
                                                    data-id_manifesto="<?php echo $coleta['id_manifesto']; ?>"
                                                    data-id_tipo_movimento="<?php echo $coleta['tipo']; ?>"
                                                    data-nome_local="<?php echo $coleta['nome_local']; ?>">LANÇAR
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
                <?php endif; ?>
                <?php
                if ($manifesto_despacho > 0) : ?>
                <div class="container theme-showcase" role="main">
                    <div class="row">
                        <div class="col-md-6">
                            <h3><b>Relação de Despacho</b></h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <a href="#">
                                <button type='button' class='btn btn-cor_02 btnGerarOcorrenciaDespacho'
                                        data-id_manifesto="<?php echo $manifesto_despacho; ?>"
                                        data-id_motorista="<?php echo $id_motorista_manifesto; ?>"
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
                        if (!$resultado_despacho || $resultado_despacho->num_rows <= 0) :
                            ?>
                            <div class="container-fluid">
                                <div class='alert alert-danger' role='alert'>Nenhum Resultado Disponível !</div>
                            </div>
                        <?php
                        // EXISTE INFORMAÇÃO
                        else :
                            ?>
                            <?php while ($despacho = mysqli_fetch_assoc($resultado_despacho)) {

                            ?>
                            <div class="col-sm-6 col-md-3">
                                <div class="thumbnail text-center">
                                    <div class="col-md-12">
                                        <label for="doc_<?php echo $despacho['id_frete']; ?>" class="btn btn-cor_03"
                                               style="width: 500px; float: left; margin-top: +20px; margin-left: 1px;">Selecionar
                                            <input
                                                    type="checkbox"
                                                    class="badgebox"
                                                    id="doc_<?php echo $despacho['id_frete']; ?>"
                                                    name="doc_<?php echo $despacho['id_frete']; ?>"
                                                    data-id_frete="<?php echo $despacho['id_frete']; ?>"
                                                    value="1"><span
                                                    class="badge marcar_todos marcar">&check;</span></label>
                                    </div>
                                    <div class="caption text-center">
                                        <br>
                                        <br>
                                        <br>
                                        <h5 class="text-left"><b><?php echo 'Frete - ' . $despacho['id_frete']; ?></b>
                                        </h5>
                                        <h5 class="text-left">
                                            <b><?php echo 'Minuta de Despacho - ' . $despacho['id_despacho']; ?></b>
                                        </h5>
                                        <?php
                                        if ($despacho['numero_cte'] == 0) : ?>
                                            <h5 class="text-left"><?php echo 'CTE - ' . 'Sem Informação'; ?></h5>
                                        <?php else : ?>
                                            <h5 class="text-left"><?php echo 'CTE - ' . $despacho['numero_cte']; ?></h5>
                                        <?php endif; ?>
                                        <h5 class="text-left"><?php echo mb_strimwidth('Destino - ' . $despacho["nome_local"], 0, 30, "..."); ?></h5>
                                        <h5 class="text-left"><?php echo 'Cidade - ' . $despacho['cidade_local']; ?></h5>
                                        <h5 class="text-left"><?php echo 'UF - ' . $despacho['uf_local']; ?></h5>
                                        <h5 class="text-left">
                                            <b><?php echo 'Status - ' . $despacho['nome_status']; ?></b></h5>
                                        <br>
                                        <p>
                                            <button type="button" class="btn btn-cor_03 btnAbrirDespachoDetalhe"
                                                    data-id_manifesto="<?php echo $despacho['id_manifesto']; ?>"
                                                    data-id_despacho="<?php echo $despacho['id_despacho']; ?>"
                                                    data-id_motorista="<?php echo $despacho['id_motorista']; ?>"
                                                    data-id_frete="<?php echo $despacho['id_frete']; ?>"
                                                    data-id_tipo_movimento="<?php echo $despacho['tipo']; ?>">DETALHE
                                            </button>
                                        </p>
                                        <p>
                                            <?php
                                            if (($despacho['status'] == 4 or $despacho['status'] == 1)) : ?>
                                                <button type="button" class="btn btn-cor_02 btnAbrirDespacho"
                                                        data-id_manifesto="<?php echo $despacho['id_manifesto']; ?>"
                                                        data-id_despacho="<?php echo $despacho['id_despacho']; ?>"
                                                        data-id_motorista="<?php echo $despacho['id_motorista']; ?>"
                                                        data-id_frete="<?php echo $despacho['id_frete']; ?>"
                                                        data-id_tipo_movimento="<?php echo $despacho['tipo']; ?>">LANÇAR
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
                    <?php endif; ?>
                    <?php
                    if ($manifesto_retirada > 0) : ?>
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
                                            data-id_manifesto="<?php echo $manifesto_retirada; ?>"
                                            data-id_motorista="<?php echo $id_motorista_manifesto; ?>"
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
                                            <h5 class="text-left">
                                                <b><?php echo 'Frete - ' . $retirada['id_frete']; ?></b></h5>
                                            <h5 class="text-left">
                                                <b><?php echo 'Retirada - ' . $retirada['id_retirada']; ?></b></h5>
                                            <?php
                                            if ($retirada['numero_cte'] == 0) : ?>
                                                <h5 class="text-left"><?php echo 'CTE - ' . 'Sem Informação'; ?></h5>
                                            <?php else : ?>
                                                <h5 class="text-left"><?php echo 'CTE - ' . $retirada['numero_cte']; ?></h5>
                                            <?php endif; ?>
                                            <h5 class="text-left"><?php echo mb_strimwidth('Destino - ' . $retirada["nome_local"], 0, 30, "..."); ?></h5>
                                            <h5 class="text-left"><?php echo 'Cidade - ' . $retirada['cidade_local']; ?></h5>
                                            <h5 class="text-left"><?php echo 'UF - ' . $retirada['uf_local']; ?></h5>
                                            <h5 class="text-left">
                                                <b><?php echo 'Status - ' . $retirada['nome_status']; ?></b></h5>
                                            <br>
                                            <p>
                                                <button type="button" class="btn btn-cor_03 btnAbrirretiradaDetalhe"
                                                        data-id_manifesto="<?php echo $retirada['id_manifesto']; ?>"
                                                        data-id_retirada="<?php echo $retirada['id_retirada']; ?>"
                                                        data-id_motorista="<?php echo $retirada['id_motorista']; ?>"
                                                        data-id_frete="<?php echo $retirada['id_frete']; ?>"
                                                        data-id_tipo_movimento="<?php echo $retirada['tipo']; ?>">
                                                    DETALHE
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
                                                            data-id_tipo_movimento="<?php echo $retirada['tipo']; ?>">
                                                        LANÇAR
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
                        <?php endif; ?>
                        <?php
                        if ($manifesto_transferencia > 0) : ?>
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
                                                data-id_manifesto="<?php echo $manifesto_transferencia; ?>"
                                                data-id_motorista="<?php echo $id_motorista_manifesto; ?>"
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
                                                <h5 class="text-left">
                                                    <b><?php echo 'Frete - ' . $transferencia['id_frete']; ?></b></h5>
                                                <h5 class="text-left">
                                                    <b><?php echo 'Transferência - ' . $transferencia['id_transferencia']; ?></b>
                                                </h5>
                                                <?php
                                                if ($transferencia['numero_cte'] == 0) : ?>
                                                    <h5 class="text-left"><?php echo 'CTE - ' . 'Sem Informação'; ?></h5>
                                                <?php else : ?>
                                                    <h5 class="text-left"><?php echo 'CTE - ' . $transferencia['numero_cte']; ?></h5>
                                                <?php endif; ?>
                                                <h5 class="text-left"><?php echo mb_strimwidth('Destino - ' . $transferencia["nome_local"], 0, 30, "..."); ?></h5>
                                                <h5 class="text-left"><?php echo 'Cidade - ' . $transferencia['cidade_local']; ?></h5>
                                                <h5 class="text-left"><?php echo 'UF - ' . $transferencia['uf_local']; ?></h5>
                                                <h5 class="text-left">
                                                    <b><?php echo 'Status - ' . $transferencia['nome_status']; ?></b>
                                                </h5>
                                                <br>
                                                <p>
                                                    <button type="button"
                                                            class="btn btn-cor_03 btnAbrirtransferenciaDetalhe"
                                                            data-id_manifesto="<?php echo $transferencia['id_manifesto']; ?>"
                                                            data-id_transferencia="<?php echo $transferencia['id_transferencia']; ?>"
                                                            data-id_motorista="<?php echo $transferencia['id_motorista']; ?>"
                                                            data-id_frete="<?php echo $transferencia['id_frete']; ?>"
                                                            data-id_tipo_movimento="<?php echo $transferencia['tipo']; ?>">
                                                        DETALHE
                                                    </button>
                                                </p>
                                                <p>
                                                    <?php
                                                    if (($transferencia['status'] != 8)) : ?>
                                                        <button type="button"
                                                                class="btn btn-cor_02 btnAbrirtransferencia"
                                                                data-id_manifesto="<?php echo $transferencia['id_manifesto']; ?>"
                                                                data-id_transferencia="<?php echo $transferencia['id_transferencia']; ?>"
                                                                data-id_motorista="<?php echo $transferencia['id_motorista']; ?>"
                                                                data-id_frete="<?php echo $transferencia['id_frete']; ?>"
                                                                data-id_tipo_movimento="<?php echo $transferencia['tipo']; ?>">
                                                            LANÇAR
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
                            <?php endif; ?>
                            <div class="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Modal Marcar -->
                <div class="modal fade" id="idMarcar" tabindex="-1" role="dialog"
                     aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="myModalLabel">ATENÇÃO !</h4>
                            </div>
                            <div class="modal-body">
                                Marque ao menos um Frete !
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger">Ok</button>
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
getJsViewMobile('motorista', 'table_entrega');
getJsViewMobile('motorista', 'table_coleta');
getJsViewMobile('motorista', 'table_despacho');
getJsViewMobile('motorista', 'table_retirada');
getJsViewMobile('motorista', 'table_transferencia');

?>
