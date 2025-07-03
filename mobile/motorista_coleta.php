<?php
include_once("../conectar.php");
include_once("controllers/motorista_manifesto.php");

$pesquisar_arroba = "SELECT * FROM arroba LIMIT 1";
$resultado_arroba = mysqli_query($conn, $pesquisar_arroba);
$arroba = mysqli_fetch_assoc($resultado_arroba);

$id_motorista = $_SESSION['usuarioIdCliente'];

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
WHERE coleta.id_motorista = '$id_motorista' and coleta_trecho.id_manifesto = 0
group by coleta.id
ORDER BY coleta.id DESC";
$resultado_coleta = mysqli_query($conn, $pesquisar_coleta);


get_elementMobile('coleta/modal-ocorrencia-coleta.php', ['conn' => $conn]);
get_elementMobile('coleta/modal-ocorrencia-coleta-detalhe.php', ['conn' => $conn]);
get_elementMobile('coleta/modal-ocorrencia-coleta-excluir.php', ['conn' => $conn]);

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
getJsViewMobile('coleta', 'funcoes');
getJsViewMobile('coleta', 'table_coleta');

?>
