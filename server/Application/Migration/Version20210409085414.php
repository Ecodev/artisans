<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20210409085414 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql("UPDATE order_line SET product_id = 928 WHERE name = 'Adapter les bâtiments au froid et aux canicules (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 934 WHERE name = 'Agriculture : de la nécessité des peuples de se nourrir eux-mêmes (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 541 WHERE name = 'Biens de consommation et chimie : privilégier les filières saines (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 611 WHERE name = 'Briser un cercle vicieux : réduire les déchets (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 862 WHERE name = 'Briser un tabou : réduire la consommation (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 290 WHERE name = 'Changement climatique : objectif 350 (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 538 WHERE name = 'Construire et rénover : les écomatériaux débordent d\\'atouts (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 942 WHERE name = 'Cultiver les savoirs pour mieux cultiver les sols (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1238 WHERE name = 'Débarrasser l\\'industrie textile du capitalisme de surveillance (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 568 WHERE name = 'Démographie : Objectif partage (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 977 WHERE name = 'Des couloirs biologiques pour laisser passer la vie (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1059 WHERE name = 'Des monnaies pour une prospérité sans croissance (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1055 WHERE name = 'Des pistes pour ralentir (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 652 WHERE name = 'Des réponses au \"Cauchemar de Darwin\" : Agriculture locale et commerce équitable (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 678 WHERE name = 'Des technologies appropriées (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 589 WHERE name = 'Ecologie : de la sensibilisation à l\\'engagement (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 926 WHERE name = 'Ecologie et emploi : un mariage de raison (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 65 WHERE name = 'Ecologie et morale. Refonder le monde sur une vision plus juste de la nature humaine (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 336 WHERE name = 'Economie solidaire et écologie, des richesses insoupçonnées (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 84 WHERE name = 'Ecoquartiers : des aspirations individuelles à l\\'intérêt collectif (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 930 WHERE name = 'Education et développement durable : le vrai chantier (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 546 WHERE name = 'Electricité et climat : Non au charbon ! Oui aux économies (version  numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 210 WHERE name = 'Eloge de la biodiversité commune (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 512 WHERE name = 'Eloge de la biodiversité culturelle (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 233 WHERE name = 'Energie : les territoires sur la voie de la transition (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 804 WHERE name = 'Energie agricole, séparer le bon grain de l\\'ivraie (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 182 WHERE name = 'Enquête sur l\\'écologie en Pologne (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 979 WHERE name = 'Extraction minière : de l\\'excès à l\\'indispensable (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 765 WHERE name = 'Faire face au changement climatique (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 983 WHERE name = 'Forger une conviction universelle sur le climat (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1260 WHERE name = 'Habitat : le pouvoir de la participation (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 53 WHERE name = 'Investir dans un monde plus juste et plus beau (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 978 WHERE name = 'Justice environnementale et climatique: au croisement du social et de l\\'écologie (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 121 WHERE name = 'L\\'agriculture regagne du terrain dans et autour des villes (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 932 WHERE name = 'L\\'eau est l\\'affaire de tous (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 534 WHERE name = 'L\\'écologie industrielle ramène l\\'économie aux limites de la Terre (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 800 WHERE name = 'L\\'écologie, une affaire de droit et de justice (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 802 WHERE name = 'L\\'écoquartier, brique d\\'une société durable (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 972 WHERE name = 'L\\'énergie citoyenne est vitale pour la transition énergétique (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 192 WHERE name = 'La durabilité à portée de main (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 162 WHERE name = 'La liberté humaine s\\'arrête aux frontières de la planète (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 630 WHERE name = 'La montagne entre protection et conquête (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 964 WHERE name = 'La permaculture : un monde d\\'abondance à découvrir (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 254 WHERE name = 'La petite agriculture familiale peut nourrir le monde (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 722 WHERE name = 'Le bois, une alternative au pétrole et au charbon (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 502 WHERE name = 'Les technologies de l\\'information et de la communication et l\\'impératif de la sobriété (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 981 WHERE name = 'Libérons-nous des énergies fossiles ! (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 944 WHERE name = 'Maîtriser la consommation d\\'électricité au Nord (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 978 WHERE name = 'N°54 Justice environnementale et climatique: au croisement du social et de l\\'écologie (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 981 WHERE name = 'N°55 Libérons-nous des énergies fossiles !';");
        $this->addSql("UPDATE order_line SET product_id = 981 WHERE name = 'N°55 Libérons-nous des énergies fossiles ! (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 983 WHERE name = 'N°56 Forger une conviction universelle sur le climat (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1053 WHERE name = 'N°57 Une seule santé pour les humains, les animaux et les écosystèmes (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1055 WHERE name = 'N°58 Des pistes pour ralentir (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1057 WHERE name = 'N°59 Pour une transition agroécologique paysanne (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1059 WHERE name = 'N°60 Des monnaies pour une prospérité sans croissance (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1061 WHERE name = 'N°61 Sobriété et liberté : à la recherche d\\'un équilibre (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1061 WHERE name = 'N°61 Sobriété et liberté : à la recherche d\\'un équilibre (version numérique) Disponible à partir du 10 juillet';");
        $this->addSql("UPDATE order_line SET product_id = 1260 WHERE name = 'N°62 Habitat : le pouvoir de la participation (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1263 WHERE name = 'N°63 Technologies numériques : en finir avec le capitalisme de surveillance (version numérique) ';");
        $this->addSql("UPDATE order_line SET product_id = 1238 WHERE name = 'N°64 Débarasser l\\'industrie textile du capitalisme de surveillance (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1238 WHERE name = 'N°64 Débarrasser l\\'industrie textile du capitalisme de surveillance (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1057 WHERE name = 'Pour une transition agroécologique paysanne (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 938 WHERE name = 'Préserver les ressources naturelles et la paix (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 940 WHERE name = 'Qualité de l\\'air : comment lutter contre la pollution (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 906 WHERE name = 'Quel tourisme pour une planète fragile ? (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 142 WHERE name = 'Quels enfants laisserons-nous à la Terre ? (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 936 WHERE name = 'Rendre les villes durables grâce à leurs habitants (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1084 WHERE name = 'Rester ouvert face aux prisons mentales';");
        $this->addSql("UPDATE order_line SET product_id = 1061 WHERE name = 'Sobriété et liberté : à la recherche d\\'un équilibre (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 701 WHERE name = 'Sur la piste d\\'une mobilité différente (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1263 WHERE name = 'Technologies numériques : en finir avec le capitalisme de surveillance (version numérique) ';");
        $this->addSql("UPDATE order_line SET product_id = 745 WHERE name = 'Touche pas à mon littoral (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 104 WHERE name = 'Un monde plus écologique est en marche (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 1053 WHERE name = 'Une seule santé pour les humains, les animaux et les écosystèmes (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 548 WHERE name = 'Vers un tourisme de proximité, riche d\\'expériences fortes (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 888 WHERE name = 'Vive la biodiversité agricole ! (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 835 WHERE name = 'Vivre ensemble en mégalopole (version numérique)';");
        $this->addSql("UPDATE order_line SET product_id = 270 WHERE name = 'Vivre heureux dans les limites écologiques (version numérique)';");
    }
}
