/* ==========================================================================
   CABINET NZEBA — Comportements de l'interface
   Vanille, sans dépendance. Dégradation gracieuse si JS indisponible.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.remove('js-off');

  /* ----------------------------------------------------------------------
     En-tête : état « posé » au défilement
     ---------------------------------------------------------------------- */
  var entete = document.querySelector('[data-entete]');

  if (entete) {
    var seuil = 24;
    var poseActif = null;

    var majEntete = function () {
      var pose = window.scrollY > seuil;
      if (pose !== poseActif) {
        poseActif = pose;
        entete.classList.toggle('entete--pose', pose);
      }
    };

    var enAttente = false;
    window.addEventListener('scroll', function () {
      if (enAttente) return;
      enAttente = true;
      window.requestAnimationFrame(function () {
        majEntete();
        enAttente = false;
      });
    }, { passive: true });

    majEntete();
  }

  /* ----------------------------------------------------------------------
     Tiroir de navigation (mobile)
     ---------------------------------------------------------------------- */
  var burger = document.querySelector('[data-burger]');
  var tiroir = document.querySelector('[data-tiroir]');

  if (burger && tiroir) {
    var focusAvant = null;

    var ouvrirTiroir = function () {
      focusAvant = document.activeElement;
      tiroir.dataset.ouvert = 'true';
      tiroir.removeAttribute('inert');
      burger.setAttribute('aria-expanded', 'true');
      document.body.dataset.fige = 'true';
      var premier = tiroir.querySelector('a, button');
      if (premier) premier.focus();
    };

    var fermerTiroir = function (rendreFocus) {
      tiroir.dataset.ouvert = 'false';
      burger.setAttribute('aria-expanded', 'false');
      delete document.body.dataset.fige;
      window.setTimeout(function () {
        if (tiroir.dataset.ouvert !== 'true') tiroir.setAttribute('inert', '');
      }, 480);
      if (rendreFocus && focusAvant) focusAvant.focus();
    };

    tiroir.setAttribute('inert', '');

    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') fermerTiroir(true);
      else ouvrirTiroir();
    });

    tiroir.addEventListener('click', function (e) {
      if (e.target.closest('a')) fermerTiroir(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        fermerTiroir(true);
      }
    });

    // Piège de focus tant que le tiroir est ouvert
    tiroir.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var cibles = tiroir.querySelectorAll('a[href], button:not([disabled])');
      if (!cibles.length) return;
      var premier = cibles[0];
      var dernier = cibles[cibles.length - 1];
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault(); dernier.focus();
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault(); premier.focus();
      }
    });

    var mqLarge = window.matchMedia('(min-width: 1001px)');
    var surChangement = function (e) {
      if (e.matches && burger.getAttribute('aria-expanded') === 'true') fermerTiroir(false);
    };
    if (mqLarge.addEventListener) mqLarge.addEventListener('change', surChangement);
    else if (mqLarge.addListener) mqLarge.addListener(surChangement);
  }

  /* ----------------------------------------------------------------------
     Apparitions au défilement
     ---------------------------------------------------------------------- */
  var aReveler = document.querySelectorAll('[data-apparait]');

  if (aReveler.length) {
    var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mouvementReduit || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(aReveler, function (el) { el.dataset.vu = 'true'; });
    } else {
      var observateur = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
          if (!entree.isIntersecting) return;
          entree.target.dataset.vu = 'true';
          observateur.unobserve(entree.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      Array.prototype.forEach.call(aReveler, function (el, i) {
        // Décalage doux entre éléments voisins d'un même groupe
        if (!el.style.getPropertyValue('--retard')) {
          var groupe = el.closest('[data-groupe]');
          if (groupe) {
            var freres = groupe.querySelectorAll('[data-apparait]');
            var rang = Array.prototype.indexOf.call(freres, el);
            el.style.setProperty('--retard', Math.min(rang, 6) * 90 + 'ms');
          }
        }
        observateur.observe(el);
      });
    }
  }

  /* ----------------------------------------------------------------------
     Année courante dans le pied de page
     ---------------------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-annee]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ----------------------------------------------------------------------
     Formulaire de prise de contact
     ---------------------------------------------------------------------- */
  var formulaire = document.querySelector('[data-formulaire]');

  if (formulaire) {
    var confirmation = document.querySelector('[data-confirmation]');
    var messages = {
      valueMissing: 'Ce champ est nécessaire au traitement de votre demande.',
      typeMismatch: 'Le format saisi ne paraît pas valide.',
      tooShort: 'Merci de préciser davantage votre demande.',
      defaut: 'Merci de vérifier cette information.'
    };

    var messagePour = function (champ) {
      var v = champ.validity;
      if (v.valueMissing) return messages.valueMissing;
      if (v.typeMismatch) return messages.typeMismatch;
      if (v.tooShort) return messages.tooShort;
      return messages.defaut;
    };

    var valider = function (champ) {
      var enveloppe = champ.closest('.champ') || champ.closest('.case');
      if (!enveloppe) return champ.checkValidity();
      var zoneErreur = enveloppe.querySelector('[data-erreur]');
      var ok = champ.checkValidity();
      enveloppe.dataset.invalide = ok ? 'false' : 'true';
      if (zoneErreur) zoneErreur.textContent = ok ? '' : messagePour(champ);
      champ.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    };

    var champs = formulaire.querySelectorAll('input:not([type="hidden"]), textarea, select');

    Array.prototype.forEach.call(champs, function (champ) {
      champ.addEventListener('blur', function () { valider(champ); });
      champ.addEventListener('input', function () {
        if (champ.getAttribute('aria-invalid') === 'true') valider(champ);
      });
    });

    formulaire.addEventListener('submit', function (e) {
      var valide = true;
      var premierFautif = null;

      Array.prototype.forEach.call(champs, function (champ) {
        if (!valider(champ)) {
          valide = false;
          if (!premierFautif) premierFautif = champ;
        }
      });

      if (!valide) {
        e.preventDefault();
        if (premierFautif) premierFautif.focus();
        return;
      }

      // Sans point de collecte configuré (attribut data-collecte), la demande
      // est composée puis remise à la messagerie du visiteur. Voir README.
      if (formulaire.hasAttribute('data-collecte')) return;

      e.preventDefault();
      if (!confirmation) return;

      var lien = confirmation.querySelector('[data-mailto]');
      if (lien) {
        var lire = function (nom) {
          var champ = formulaire.elements[nom];
          return champ && champ.value ? String(champ.value).trim() : '';
        };
        var objet = lire('objet') || 'Demande';
        var corps = [
          'Nom et prénom : ' + lire('nom'),
          'Adresse électronique : ' + lire('email'),
          'Téléphone : ' + (lire('telephone') || 'non communiqué'),
          'Nature de la demande : ' + objet,
          'Échéance envisagée : ' + (lire('delai') || 'non déterminée'),
          '',
          'Demande :',
          lire('message'),
          '',
          '— Message composé depuis cabinetnzeba.com'
        ].join('\r\n');

        var destinataire = lien.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
        lien.setAttribute('href',
          'mailto:' + destinataire +
          '?subject=' + encodeURIComponent('Cabinet Nzeba — ' + objet) +
          '&body=' + encodeURIComponent(corps));
      }

      formulaire.hidden = true;
      confirmation.hidden = false;
      confirmation.setAttribute('tabindex', '-1');
      confirmation.focus();
      confirmation.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    var reprendre = document.querySelector('[data-reprendre]');
    if (reprendre && confirmation) {
      reprendre.addEventListener('click', function () {
        confirmation.hidden = true;
        formulaire.hidden = false;
        formulaire.scrollIntoView({ block: 'start', behavior: 'smooth' });
        var premier = formulaire.querySelector('input, textarea, select');
        if (premier) premier.focus();
      });
    }
  }
})();
