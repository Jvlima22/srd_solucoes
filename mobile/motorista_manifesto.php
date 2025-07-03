<?php
include_once("../conectar.php");
include_once("controllers/motorista_manifesto.php");

$pesquisar_arroba = "SELECT * FROM arroba LIMIT 1";
$resultado_arroba = mysqli_query($conn, $pesquisar_arroba);
$arroba = mysqli_fetch_assoc($resultado_arroba);

$pagina = $_REQUEST['pagina'];
if (intval($pagina) == 0) {
    $pagina = 1;
}
$qnt_result_pg = 2;


// Filtros de pesquisar
$dadosPesquisa = getConsultaFiltroPesquisaManifestoMotorista($pagina, $qnt_result_pg);

$resultado = mysqli_query($conn, $dadosPesquisa['sqlBusca']);
$total_pesquisa = mysqli_num_rows($resultado);

$resultado_total = mysqli_query($conn, $dadosPesquisa['sqlCount']);
$total = mysqli_fetch_assoc($resultado_total);
$total = $total['num_result'];

get_elementMobile('motorista/modal-alerta-iniciar-transporte.php', ['conn' => $conn]);
get_elementMobile('motorista/modal-iniciar-transporte.php', ['conn' => $conn]);
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
<body>
<form method="POST" id="form_pesquisa">
    <div class="container theme-showcase" role="main">
        <div class="row">
            <div class="col-md-6">
                <h3>Relação de Manifesto</h3>
            </div>
        </div>
    </div>
    </div>
    <div class="container theme-showcase" role="main">
        <div class="page-header">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-5">
                        <label>Manifesto:</label>
                        <input type="text" class="form-control " id="id_manifesto"
                               name="filtros[id_manifesto]"
                               value="<?= getPostVal('filtros', 'id_manifesto'); ?>">
                    </div>
                    <div class="col-md-5">
                        <label>Status:</label>
                        <input type="hidden" id="id_status"
                               name="filtros[id_status]" value="<?= getPostVal('filtros', 'id_status'); ?>"
                               idselect="pesquisar_status">
                        <select class="form-control ajustaIdSelect" id="pesquisar_status">
                            <option value="">...</option>
                            <?php
                            $id_status = getPostVal('filtros', 'id_status');
                            $pesquisar_status = "SELECT status_movimento.* FROM status_movimento 
							WHERE (status_movimento.id = 4 or status_movimento.id = 8 or status_movimento.id = 1) ORDER BY status_movimento.id ASC";
                            $resultado_status = mysqli_query($conn, $pesquisar_status);
                            while ($listar_status = mysqli_fetch_assoc($resultado_status)) { ?>
                                <option value="<?php echo $listar_status['nome']; ?>"
                                        idoption="<?= $listar_status['id']; ?>"
                                    <?php if ($id_status == $listar_status['id']) { ?> selected="selected" <?php } ?>><?php echo $listar_status['nome']; ?></option> <?php
                            }
                            ?>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label>
                            <button type='submit' class='btn btn-cor_03'
                                    style="float: right; margin-top: +22px; margin-right: 3px;">PESQUISAR
                            </button>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    <div class="form-group">
        <div class="container marketing">
            <div class="row">
                <?php
                // NÃO POSSUI INFORMAÇÃO
                if (!$resultado || $resultado->num_rows <= 0) :
                    ?>
                    <div class="container-fluid">
                        <div class='alert alert-danger' role='alert'>Nenhum Resultado Encontrado !</div>
                    </div>
                <?php
                // EXISTE INFORMAÇÃO
                else :
                    ?>
                    <?php while ($listar = mysqli_fetch_assoc($resultado)) {


                    $pesquisar_entrega = "SELECT 
					frete.id 
					FROM frete
					JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete.id	and manifesto_movimento.id_tipo_movimento = 4			
					WHERE manifesto_movimento.id_manifesto = '" . $listar['id'] . "' ";
                    $resultado_entrega = mysqli_query($conn, $pesquisar_entrega);
                    $entregas = mysqli_num_rows($resultado_entrega);

                    $pesquisar_entrega_finalizado = "SELECT 
					frete.id 
					FROM frete
					JOIN manifesto_movimento ON manifesto_movimento.id_movimento = frete.id	and manifesto_movimento.id_tipo_movimento = 4				
					WHERE (frete.status = 8 or frete.status = 9) and 
					manifesto_movimento.id_manifesto = '" . $listar['id'] . "'
					group by frete.id_frete";
                    $resultado_entrega_finalizado = mysqli_query($conn, $pesquisar_entrega_finalizado);
                    $entregaFinalizada = mysqli_num_rows($resultado_entrega_finalizado);

                    $pesquisar_coleta = "SELECT 
					coleta.id 
					FROM coleta
					JOIN coleta_trecho ON coleta_trecho.id_coleta = coleta.id	
					WHERE coleta_trecho.id_manifesto = '" . $listar['id'] . "'
					group by coleta.id ";
                    $resultado_coleta = mysqli_query($conn, $pesquisar_coleta);
                    $coletas = mysqli_num_rows($resultado_coleta);

                    $pesquisar_coleta_finalizado = "SELECT 
					coleta.id 
					FROM coleta
					JOIN coleta_trecho ON coleta_trecho.id_coleta = coleta.id
					WHERE (coleta.status = 5 or coleta.status = 7) and 
					coleta_trecho.id_manifesto = '" . $listar['id'] . "'";
                    $resultado_coleta_finalizado = mysqli_query($conn, $pesquisar_coleta_finalizado);
                    $coletaFinalizada = mysqli_num_rows($resultado_coleta_finalizado);

                    $pesquisar_despacho = "SELECT 
					minuta.id 
					FROM minuta
					WHERE minuta.id_manifesto = '" . $listar['id'] . "'";
                    $resultado_despacho = mysqli_query($conn, $pesquisar_despacho);
                    $despachos = mysqli_num_rows($resultado_despacho);

                    $pesquisar_despacho_finalizado = "SELECT 
					minuta.id 
					FROM minuta
					WHERE minuta.id_manifesto = '" . $listar['id'] . "' and minuta.status != 1";
                    $resultado_despacho_finalizado = mysqli_query($conn, $pesquisar_despacho_finalizado);
                    $despachoFinalizada = mysqli_num_rows($resultado_despacho_finalizado);

                    $pesquisar_retirada = "SELECT 
					retirada.id 
					FROM retirada
					WHERE retirada.id_manifesto = '" . $listar['id'] . "'";
                    $resultado_retirada = mysqli_query($conn, $pesquisar_retirada);
                    $retiradas = mysqli_num_rows($resultado_retirada);

                    $pesquisar_retirada_finalizado = "SELECT 
					retirada.id 
					FROM retirada
					WHERE retirada.id_manifesto = '" . $listar['id'] . "' and retirada.status != 1";
                    $resultado_retirada_finalizado = mysqli_query($conn, $pesquisar_retirada_finalizado);
                    $retiradaFinalizada = mysqli_num_rows($resultado_retirada_finalizado);

                    $pesquisar_transferencia = "SELECT 
					transferencia.id 
					FROM transferencia
					WHERE transferencia.id_manifesto = '" . $listar['id'] . "'";
                    $resultado_transferencia = mysqli_query($conn, $pesquisar_transferencia);
                    $transferencias = mysqli_num_rows($resultado_transferencia);

                    $pesquisar_transferencia_finalizado = "SELECT 
					transferencia.id 
					FROM transferencia
					WHERE transferencia.id_manifesto = '" . $listar['id'] . "' and transferencia.status != 1";
                    $resultado_transferencia_finalizado = mysqli_query($conn, $pesquisar_transferencia_finalizado);
                    $transferenciaFinalizada = mysqli_num_rows($resultado_transferencia_finalizado);


                    ?>
                    <div class="col-sm-6 col-md-4">
                        <div class="thumbnail text-center">
                            <br>
                            <button class="btn btn-cor_03" type="button">
                                Manifesto <span class="badge"><?php echo $listar['id']; ?></span>
                            </button>
                            <div class="caption text-center">
                                <h4 class="text-left">
                                    <?php
                                    if ($entregas > 0) : ?>
                                        <?php
                                        if ($listar['status_manifesto'] == 4) : ?>
                                            <a
                                                    href="administrativo.php?link=4041&entrega=<?php echo $listar['id']; ?>"
                                                    parametro=""
                                                    class="abrirModal">
                                                <button type="button" class="btn btn-success" data-toggle="modal"
                                                        data-target="#coleta<?php echo $listar['id']; ?>">Baixar
                                                </button>
                                            </a>
                                        <?php elseif ($listar['status_manifesto'] == 1): ?>
                                            <button type="button" class="btn btn-success" data-toggle="modal"
                                                    data-target="#alerta_iniciar_transporte">Baixar
                                            </button>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <?php
                                        if ($listar['status_manifesto'] != 8) : ?>
                                        <button type="button" class="btn btn-success">Inativo
                                        </button>
                                        <?php endif; ?>
                                    <?php endif; ?><span
                                            class="glyphicon glyphicon-arrow-right text-success"></span> <?php echo 'Entrega - ' . $entregas; ?>
                                    / <?php echo $entregaFinalizada; ?></h4>
                                <h4 class="text-left">
                                    <?php
                                    if ($coletas > 0) : ?>
                                        <?php
                                        if ($listar['status_manifesto'] == 4) : ?>
                                            <a
                                                    href="administrativo.php?link=4041&coleta=<?php echo $listar['id']; ?>"
                                                    parametro=""
                                                    class="abrirModal">
                                                <button type="button" class="btn btn-warning" data-toggle="modal"
                                                        data-target="#coleta<?php echo $listar['id']; ?>">Baixar
                                                </button>
                                            </a>
                                        <?php elseif ($listar['status_manifesto'] == 1): ?>
                                            <button type="button" class="btn btn-warning" data-toggle="modal"
                                                    data-target="#alerta_iniciar_transporte">Baixar
                                            </button>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <?php
                                        if ($listar['status_manifesto'] != 8) : ?>
                                            <button type="button" class="btn btn-warning">Inativo
                                            </button>
                                        <?php endif; ?>
                                    <?php endif; ?>
                                    <span
                                            class="glyphicon glyphicon glyphicon-arrow-left text-warning"></span> <?php echo 'Coleta - ' . $coletas; ?>
                                    / <?php echo $coletaFinalizada; ?></h4>

                                <h4 class="text-left">
                                    <?php
                                    if ($despachos > 0) : ?>
                                        <?php
                                        if ($listar['status_manifesto'] == 4) : ?><a
                                            href="administrativo.php?link=4041&despacho=<?php echo $listar['id']; ?>"
                                            parametro=""
                                            class="abrirModal">
                                            <button type="button" class="btn btn-primary" data-toggle="modal"
                                                    data-target="#coleta<?php echo $listar['id']; ?>">Baixar
                                            </button>
                                            </a>  <?php elseif ($listar['status_manifesto'] == 1): ?>
                                            <button type="button" class="btn btn-primary" data-toggle="modal"
                                                    data-target="#alerta_iniciar_transporte">Baixar
                                            </button>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <?php
                                        if ($listar['status_manifesto'] != 8) : ?>
                                            <button type="button" class="btn btn-primary">Inativo
                                            </button>
                                        <?php endif; ?>
                                    <?php endif; ?><span
                                            class="glyphicon glyphicon glyphicon-arrow-up text-primary	"></span> <?php echo 'Despacho - ' . $despachos; ?>
                                    / <?php echo $despachoFinalizada; ?></h4>
                                <h4 class="text-left">
                                    <?php
                                    if ($retiradas > 0) : ?><?php
                                        if ($listar['status_manifesto'] == 4) : ?><a
                                            href="administrativo.php?link=4041&retirada=<?php echo $listar['id']; ?>"
                                            parametro=""
                                            class="abrirModal">
                                            <button type="button" class="btn btn-info" data-toggle="modal"
                                                    data-target="#coleta<?php echo $listar['id']; ?>">Baixar
                                            </button>
                                            </a>  <?php elseif ($listar['status_manifesto'] == 1): ?>
                                            <button type="button" class="btn btn-info" data-toggle="modal"
                                                    data-target="#alerta_iniciar_transporte">Baixar
                                            </button>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <?php
                                        if ($listar['status_manifesto'] != 8) : ?>
                                            <button type="button" class="btn btn-info">Inativo
                                            </button>
                                        <?php endif; ?>
                                    <?php endif; ?><span
                                            class="glyphicon glyphicon glyphicon-arrow-down text-info"></span> <?php echo 'Retirada - ' . $retiradas; ?>
                                    / <?php echo $retiradaFinalizada; ?></h4>
                                <h4 class="text-left">
                                    <?php
                                    if ($transferencias > 0) : ?><?php
                                        if ($listar['status_manifesto'] == 4) : ?><a
                                            href="administrativo.php?link=4041&transferencia=<?php echo $listar['id']; ?>"
                                            parametro=""
                                            class="abrirModal">
                                            <button type="button" class="btn btn-default" data-toggle="modal"
                                                    data-target="#coleta<?php echo $listar['id']; ?>">Baixar
                                            </button>
                                            </a> <?php elseif ($listar['status_manifesto'] == 1): ?>
                                            <button type="button" class="btn btn-default" data-toggle="modal"
                                                    data-target="#alerta_iniciar_transporte">Baixar
                                            </button>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <?php
                                        if ($listar['status_manifesto'] != 8) : ?>
                                            <button type="button" class="btn btn-default">Inativo
                                            </button>
                                        <?php endif; ?>
                                    <?php endif; ?><span
                                            class="glyphicon glyphicon glyphicon-share-alt text-default"></span> <?php echo 'Transferência - ' . $transferencias; ?>
                                    / <?php echo $transferenciaFinalizada; ?></h4>
                                <br>
                                <p>
                                    <?php
                                    if ($listar['status_manifesto'] == 1) : ?>
                                        <button type="button" class="btn btn-danger btnAbrirIniciarTransporte"
                                                data-id_manifesto="<?php echo $listar['id']; ?>"
                                                data-id_motorista="<?php echo $listar['id_motorista']; ?>">INICIAR
                                            TRANSPORTE
                                        </button>
                                    <?php elseif ($listar['status_manifesto'] == 4): ?>
                                        <button type="button" class="btn btn-primary">EM TRANSITO
                                        </button>
                                    <?php elseif ($listar['status_manifesto'] == 8): ?>
                                        <button type="button" class="btn btn-success">FINALIZADO
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
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12">
                            <?php
                            //Quantidade de pagina
                            $quantidade_pg = ceil($total / $qnt_result_pg);

                            //Limitar os link antes depois
                            $max_links = 5;

                            echo '<nav aria-label="paginacao">';
                            echo '<input type="hidden" name="pagina" id="pagina" value="1">';
                            echo '<ul class="pagination">';
                            echo '<li class="page-item">';
                            echo "<span class='page-link'><a href='#' onclick='setPaginacao(1)'>Primeira</a> </span>";
                            echo '</li>';
                            for ($pag_ant = $pagina - $max_links; $pag_ant <= $pagina - 1; $pag_ant++) {
                                if ($pag_ant >= 1) {
                                    echo "<li class='page-item'><a class='page-link' href='#' onclick='setPaginacao($pag_ant)'>$pag_ant </a></li>";
                                }
                            }
                            echo '<li class="page-item active">';
                            echo '<span class="page-link">';
                            echo "$pagina";
                            echo '</span>';
                            echo '</li>';
                            for ($pag_dep = $pagina + 1; $pag_dep <= $pagina + $max_links; $pag_dep++) {
                                if ($pag_dep <= $quantidade_pg) {
                                    echo "<li class='page-item'><a class='page-link' href='#' onclick='setPaginacao($pag_dep)'>$pag_dep</a></li>";
                                }
                            }
                            echo '<li class="page-item">';
                            echo "<span class='page-link'><a href='#' onclick='setPaginacao($quantidade_pg)'>Última</a></span>";
                            echo '</li>';
                            echo '</ul>';
                            echo '</nav>';
                            ?>
                        </div>
                    </div>
</form>
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
?>
